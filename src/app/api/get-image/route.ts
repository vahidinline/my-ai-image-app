import { GoogleAuth } from 'google-auth-library';
import { NextResponse } from 'next/server';
import path from 'path';

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

    const inputPayload = {
      instances: [
        {
          text: prompt,
          num_images: n_samples,
          guidance_scale: cfg_scale,
          seed,
          steps: num_inference_steps,
          resolution: image_size,
          style: style || 'default',
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

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error from Google API:', errorBody);
      return NextResponse.json(
        { error: 'Failed to generate image', details: errorBody },
        { status: 500 }
      );
    }

    const responseBody = await response.json();
    return NextResponse.json(responseBody.predictions[0].output);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
