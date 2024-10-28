'use client'; // Marks this as a Client Component

import {
  Accordion,
  Button,
  FileInput,
  Flowbite,
  Label,
  Spinner,
  Textarea,
  TextInput,
} from 'flowbite-react';
import { useSession } from 'next-auth/react';

import { useState } from 'react';

const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [translatedPrompt, setTranslatedPrompt] = useState(''); // Store the translated prompt
  const [n_samples, setNSamples] = useState(1);
  const [cfg_scale, setCfgScale] = useState(7.5);
  const [seed, setSeed] = useState('');
  const [num_inference_steps, setNumInferenceSteps] = useState(50);

  const [height, setHeight] = useState('512');
  const [width, setWidth] = useState('512');
  const [initImage, setInitImage] = useState('');
  const [imageData, setImageData] = useState(''); // Store Base64 image data
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(''); // Store error message
  const { data: session } = useSession();

  if (!session) return <div>Not authenticated</div>;
  // Function to translate the Persian prompt to English
  const translatePrompt = async (text: string) => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text, // Send the Persian prompt
          target_lang: 'english', // Target language is English
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return data.result.translated_text; // Return the translated text
      } else {
        throw new Error(data.errors?.[0] || 'Translation failed.');
      }
    } catch (error) {
      setErrorMessage(`Translation Error`);
      setStatus('idle'); // Reset the status in case of an error
      return '';
    }
  };

  // Function to handle image file input and convert to Base64
  const handleFileChange = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      setInitImage(base64data.split(',')[1]); // Store the Base64 string without the prefix
    };
    reader.readAsDataURL(file); // Read file and convert to base64
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Step 1: Translate the Persian prompt to English
    const englishPrompt = await translatePrompt(prompt);
    if (!englishPrompt) return; // Stop if translation failed

    setTranslatedPrompt(englishPrompt); // Store translated prompt for debugging

    // Step 2: Send the translated prompt and parameters to the image generation API
    try {
      const response = await fetch('/api/get-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: englishPrompt, // Use the translated prompt
          parameters: {
            n_samples,
            cfg_scale,
            seed: seed ? parseInt(seed) : undefined, // Convert seed to number if provided
            num_inference_steps,
            height: height ? parseInt(height) : 512,
            width: width ? parseInt(width) : 512,
            init_image: initImage,
          },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setImageData(result.image); // Store the Base64 image data
        setStatus('success');
      } else {
        throw new Error(result.error || 'Image generation failed.');
      }
    } catch (error) {
      setErrorMessage(`Image Generation Error`);
      setStatus('idle');
    }
  };

  return (
    <Flowbite>
      <div className="container mx-auto p-4 max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div>
            <Label htmlFor="prompt" value="پرامپت" className="text-lg mb-2" />
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="تصویری که قصد ایجاد آنرا دارید توصیف کنید"
              required
              rows={4}
              className="w-full"
            />
          </div>

          <Accordion collapseAll>
            <Accordion.Panel>
              <Accordion.Title>تنظیمات پیشرفته </Accordion.Title>
              <Accordion.Content>
                {/* Advanced settings (disabled) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <div>
                    <Label htmlFor="n_samples" value="Sample Count (1-4)" />
                    <TextInput
                      id="n_samples"
                      type="number"
                      value={n_samples}
                      onChange={(e) => setNSamples(Number(e.target.value))}
                      min={1}
                      max={4}
                    />
                  </div> */}
                  <div>
                    <Label htmlFor="style" value="Image (optional)" />
                    <FileInput
                      id="style"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cfg_scale" value="Guidance Scale (0-20)" />
                    <TextInput
                      id="cfg_scale"
                      type="number"
                      step="0.1"
                      value={cfg_scale}
                      onChange={(e) => setCfgScale(Number(e.target.value))}
                      min={0}
                      max={20}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seed" value="Seed (optional)" />
                    <TextInput
                      id="seed"
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      placeholder="For reproducibility"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="num_inference_steps"
                      value="Inference Steps"
                    />
                    <TextInput
                      id="num_inference_steps"
                      type="number"
                      value={num_inference_steps}
                      onChange={(e) =>
                        setNumInferenceSteps(Number(e.target.value))
                      }
                      min={1}
                      max={100}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image_size" value="Height" />
                    <TextInput
                      id="image_size"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_size" value="Width" />
                    <TextInput
                      id="image_size"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>

          <Button type="submit" className="w-full text-lg py-3">
            {status === 'loading' ? (
              <>
                <Spinner size="sm" light={true} />
                <span className="ml-2">...در حال ایجاد تصویر</span>
              </>
            ) : (
              'ایجاد تصویر'
            )}
          </Button>
        </form>

        {imageData && (
          <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            {/* <h2 className="text-2xl font-semibold mb-4 text-center">
              {translatedPrompt}
            </h2> */}
            <div className="flex justify-center">
              <img
                className="max-w-full h-auto rounded-lg"
                src={`data:image/jpeg;base64,${imageData}`}
                alt="Generated by AI"
              />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 text-red-600 text-center">{errorMessage}</div>
        )}
      </div>
    </Flowbite>
  );
};

export default Home;
