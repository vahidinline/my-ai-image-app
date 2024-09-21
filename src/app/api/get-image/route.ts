import { GoogleAuth } from 'google-auth-library';
import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import Request from '@/models/Request';

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
    projectId: process.env.GOOGLE_PROJECT_ID,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

export async function POST(req: Request) {
  try {
    const {
      userId = '1',
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

    // Connect to MongoDB
    await connectToDB();

    // Create a new request entry in the database
    const newRequest = new Request({
      userId,
      prompt,
      parameters: {
        n_samples,
        cfg_scale,
        seed,
        num_inference_steps,
        image_size,
        style,
      },
    });
    const savedRequest = await newRequest.save();

    // Get access token for Google API
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
    const generatedImage = responseBody.predictions[0].output;

    // Update the request entry with the generated image output
    savedRequest.output = generatedImage;
    savedRequest.updatedAt = new Date();
    await savedRequest.save();

    // Return the generated image to the user
    return NextResponse.json({ image: generatedImage });
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
