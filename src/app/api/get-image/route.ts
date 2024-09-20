import { GoogleAuth } from 'google-auth-library';
import { NextResponse } from 'next/server';
import path from 'path';

const PROJECT_ID = process.env.PROJECT_ID;
const ENDPOINT_ID = process.env.ENDPOINT_ID;

// Load the service account key from the config file
const keyFilePath = path.join(process.cwd(), 'src/config/key.json');

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

export async function POST(req: Request) {
  try {
    const {
      prompt,
      n_samples,
      cfg_scale,
      seed,
      num_inference_steps,
      image_size,
      style,
    } = await req.json();

    // Restructure the input payload for FLUX.1-schnell compatibility
    const inputPayload = {
      instances: [
        {
          text: prompt, // Check if 'text' is required instead of 'prompt'
          num_images: n_samples, // 'num_images' instead of 'n_samples'
          guidance_scale: cfg_scale, // 'guidance_scale' instead of 'cfg_scale'
          seed, // Seed might be supported as is
          steps: 20, // 'steps' instead of 'num_inference_steps'
          resolution: image_size, // Image size might need to be explicitly named 'resolution'
          style: style || 'default', // Style, if supported; otherwise, default to 'default'
        },
      ],
    };

    const accessToken = await getAccessToken();

    const endpoint = process.env.GOOGLE_ENDPOINT_URL;
    if (!endpoint) throw new Error('GOOGLE_ENDPOINT_URL is not defined');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputPayload),
    });

    // Handle response stream

    const responseBody = await response.json(); // Read and parse the response body
    console.log(responseBody);
    // Assuming 'predictions' contains the desired image URL
    return NextResponse.json(responseBody.predictions[0].output);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
