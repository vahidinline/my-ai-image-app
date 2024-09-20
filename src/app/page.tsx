'use client'; // Marks this as a Client Component

import { Button, Label, Spinner, Textarea, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { DarkThemeToggle, Flowbite } from 'flowbite-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [n_samples, setNSamples] = useState(1);
  const [cfg_scale, setCfgScale] = useState(7.5);
  const [seed, setSeed] = useState('');
  const [num_inference_steps, setNumInferenceSteps] = useState(50);
  const [image_size, setImageSize] = useState('512x512');
  const [style, setStyle] = useState('');
  const [imageData, setImageData] = useState(''); // This will store Base64 image data
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    // Send prompt and parameters to the API
    const response = await fetch('/api/get-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt, // Send the prompt
        parameters: {
          n_samples,
          cfg_scale,
          seed: seed ? parseInt(seed) : undefined, // Convert seed to number if provided
          num_inference_steps,
          image_size,
          style,
        },
      }),
    });

    const result = await response.json();
    setImageData(result); // This will be a Base64 string of the image
    setStatus('success');
  };

  return (
    <Flowbite>
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          AI Image Generator
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div>
            <Label
              htmlFor="prompt"
              value="Enter your prompt"
              className="text-lg mb-2"
            />
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              required
              rows={4}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="n_samples"
                value="Number of Samples"
                className="mb-2"
              />
              <TextInput
                id="n_samples"
                type="number"
                value={n_samples}
                onChange={(e) => setNSamples(Number(e.target.value))}
                min={1}
                max={4}
                disabled
              />
            </div>

            <div>
              <Label
                htmlFor="cfg_scale"
                value="Guidance Scale"
                className="mb-2"
              />
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
              <Label htmlFor="seed" value="Seed (optional)" className="mb-2" />
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
                className="mb-2"
              />
              <TextInput
                id="num_inference_steps"
                type="number"
                value={num_inference_steps}
                onChange={(e) => setNumInferenceSteps(Number(e.target.value))}
                min={1}
                max={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image_size" value="Image Size" className="mb-2" />
              <TextInput
                id="image_size"
                value={image_size}
                onChange={(e) => setImageSize(e.target.value)}
                placeholder="e.g., 512x512"
              />
            </div>

            <div>
              <Label
                htmlFor="style"
                value="Style (optional)"
                className="mb-2"
              />
              <TextInput
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g., photorealistic"
              />
            </div>
          </div>

          <Button type="submit" className="w-full text-lg py-3">
            {status === 'loading' ? (
              <>
                <Spinner size="sm" light={true} />
                <span className="ml-2">Generating...</span>
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        </form>

        {imageData && (
          <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Generated Image
            </h2>
            <div className="flex justify-center">
              <img
                className="max-w-full h-auto rounded-lg"
                src={`data:image/jpeg;base64,${imageData}`}
                alt="Generated by AI"
              />
            </div>
          </div>
        )}

        <div className="fixed bottom-4 right-4">
          <DarkThemeToggle />
        </div>
      </div>
    </Flowbite>
  );
}
