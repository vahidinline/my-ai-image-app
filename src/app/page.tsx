'use client'; // Marks this as a Client Component

import {
  Accordion,
  Button,
  Carousel,
  Flowbite,
  Label,
  Spinner,
  Textarea,
  TextInput,
} from 'flowbite-react';
import { useState } from 'react';

import { ACarousel } from '@/component/Home/Carousel';
import HeroSection from '@/component/Home/HeroSection';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [translatedPrompt, setTranslatedPrompt] = useState(''); // Store the translated prompt
  const [n_samples, setNSamples] = useState(1);
  const [cfg_scale, setCfgScale] = useState(7.5);
  const [seed, setSeed] = useState('');
  const [num_inference_steps, setNumInferenceSteps] = useState(50);
  const [image_size, setImageSize] = useState('512x512');
  const [style, setStyle] = useState('');
  const [imageData, setImageData] = useState(''); // Store Base64 image data
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(''); // Store error message

  return (
    <Flowbite>
      <HeroSection />
    </Flowbite>
  );
}
