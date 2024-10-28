import { GoogleAuth } from 'google-auth-library';
import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db1';
import Request from '@/models/Request';
import Bugsnag from '@bugsnag/js';

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: {
      client_email:
        'aifoodnutritiondata@fitlinez-backend.iam.gserviceaccount.com',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCriP+b6rjfTudC\n0pCO+UV7M8QCGYGhk+/asbU8oIAKLPkNenolq+99+Y0jXDlWfX8EhYphyvG6iNnC\nFGRC45KZ3XgeLXnSX0t+51K0iQQ8pqWaP45ec48VPJSs1ruabO9c0mhXiLSDUXoV\n3+rb1FYAzBwtehk0irXXNWTBmw+JgM+QeSkH5kQWJeYxUF1G7DI06TIdERmbm/xH\nwv3arMmpqBmJSOltUfw0bCla4g434Kir72G82tJ9srJdzLRBv/S39jO2dOQ3y1PY\nVaHsoJuS7zYap0szx0aFhndDKDMK0BCW86gHzz6y3DCX7uo3X1JQaqUqVTrR0Epy\nRT+pX/mNAgMBAAECggEAHmskNtxELfdyS7eG4o/COkOXA+9NfV98VooSc16b7hIF\nFVaNkB4iEXMeS/G4CkYlbuIWhNqGDNflU8UldXYhQm9TdHiIhJ2ZB/dSA4lTqsS7\nk7OnFclEy5WLYO4QZSVhuhJm5fTsW+goL/ZeEd8g5DHN4mOnUhmx/uitRibu9alL\nS/xVVd8hyLZJap6hb9h+j8+NwJfhfS/iwyKK9M/LG1mO+UQ74NVM5Xjr1/K/lAHF\nj+oOCYxsc41eZ/AKy5+ieqaoG5CVz90Og8HywOgxaZgqnBo3NEpa7OkQ1DLD3LXz\nXrdJw8nPVvwsblUADZNpsrjaHKuJFznX/uoXmP/baQKBgQDfb3X1+ZG4TW8roUZp\nSinS298Qa7UjG2e1mZwT/9nuh29u9pG37qfTbO5IKroXLV7MJg4NBJp1vjMwYn+j\n47QcV4ZjNtLXTWS8OlF+U8oZ98Ttzffwxkm8uvQLp480tLemseVxnx/gZ3tbkn4A\nS820ZNdOb8pJvNnPtcogu+ZndQKBgQDEiRnyarLPW3ofUFE7vMrdvF7rkrc/zUa4\nSZmaoUbBn1tbtmEbJXAM/xJPxRVHioCX4tylRzNnjwN+L6aiYSz9NMfMWjyfDFv6\nREgjYUNnbOfD8L7PVXkxrL8nO87qd8egG05hKbY4vH1xQJkOYqPdw7F/kUazJTWs\nAw+nMFGeuQKBgFBsCRRpKQcicAJPQU3CkP1BgK+jZQZm5dRanvAf5ixR+U0CWP7Q\nWv3htn6pSmPvQ7DNfb83yfTZaglfWrv9yKVu54Msh4VRaRHLF+wVcqgYI3zI5xZ1\n+LKCxDaxr/zzkyrf20sjUFDwTlluiAXJQxhMN6cW28PgwrFdqIxRtaPFAoGAO3nm\nIUeK71eWoI1U2AgtOGc+LnpK/ILpyPF1C6eM2yGXqyyJPIba3wP+Daft5aWTfuOH\ntHjUpJ1SCEjxW6iezc3APSZ9vAAogZdSYWqY1F7P0Ks1g1cxgwftHTlrR+eRwPEi\niiLuY0MfjztmVkUhpAYJ3DohtCspj/GpNgZYXPkCgYBgRTq/mEThIHNHcmh5ez50\nAyjaK+/ibcsejY/WSEaME2W9nE8JfnoowWlDf2Y0o60IYLHqW648kIMHCvrEZHwg\nq7IUhloCZgTFA9al0napPM2FHA56JukCWGEomuoHs09nlJrfZR1Hd97HGzGralFR\nYa/OXvHoTpFDUN+dzU4LJA==\n-----END PRIVATE KEY-----\n',
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
      height,
      width,
      init_image,
    } = await req.json();
    console.log(req.json());
    const inputPayload = {
      instances: [
        {
          text: prompt,
        },
      ],
      parameters: {
        height: height,
        width: width,
        num_inference_steps: num_inference_steps,
        guidance_scale: cfg_scale,
        init_image: init_image,
      },
    };

    // Connect to MongoDB
    const resTodB = await connectToDB();
    console.log(resTodB);
    // Create a new request entry in the database
    const newRequest = new Request({
      userId,
      prompt,
      parameters: {
        n_samples,
        cfg_scale,
        seed,
        num_inference_steps,
      },
    });
    const savedRequest = await newRequest.save();

    // Get access token for Google API
    const accessToken = await getAccessToken();

    const endpoint = process.env.GOOGLE_ENDPOINT_URL;
    if (!endpoint) {
      Bugsnag.notify(new Error('GOOGLE_ENDPOINT_URL is not defined'));
      return NextResponse.json(
        {
          error: 'Failed to generate image',
          details: 'GOOGLE_ENDPOINT_URL is not defined',
        },
        { status: 500 }
      );
    }

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
      Bugsnag.notify(new Error(errorBody));
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
    Bugsnag.notify(error as Error);
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// import { GoogleAuth } from 'google-auth-library';
// import { NextResponse } from 'next/server';
// import connectToDB from '@/lib/db1';
// import Request from '@/models/Request';
// import Bugsnag from '@bugsnag/js';

// // Helper function to process image data (base64 or URL)
// function processInitImage(initImage: string): string {
//   // If the init image is a URL, you may want to download it and convert it to base64
//   // For simplicity, we assume the initImage is already in base64 format
//   return initImage;
// }

// async function getAccessToken() {
//   const auth = new GoogleAuth({
//     credentials: {
//       client_email:
//         'aifoodnutritiondata@fitlinez-backend.iam.gserviceaccount.com',
//       private_key:
//         '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCriP+b6rjfTudC\n0pCO+UV7M8QCGYGhk+/asbU8oIAKLPkNenolq+99+Y0jXDlWfX8EhYphyvG6iNnC\nFGRC45KZ3XgeLXnSX0t+51K0iQQ8pqWaP45ec48VPJSs1ruabO9c0mhXiLSDUXoV\n3+rb1FYAzBwtehk0irXXNWTBmw+JgM+QeSkH5kQWJeYxUF1G7DI06TIdERmbm/xH\nwv3arMmpqBmJSOltUfw0bCla4g434Kir72G82tJ9srJdzLRBv/S39jO2dOQ3y1PY\nVaHsoJuS7zYap0szx0aFhndDKDMK0BCW86gHzz6y3DCX7uo3X1JQaqUqVTrR0Epy\nRT+pX/mNAgMBAAECggEAHmskNtxELfdyS7eG4o/COkOXA+9NfV98VooSc16b7hIF\nFVaNkB4iEXMeS/G4CkYlbuIWhNqGDNflU8UldXYhQm9TdHiIhJ2ZB/dSA4lTqsS7\nk7OnFclEy5WLYO4QZSVhuhJm5fTsW+goL/ZeEd8g5DHN4mOnUhmx/uitRibu9alL\nS/xVVd8hyLZJap6hb9h+j8+NwJfhfS/iwyKK9M/LG1mO+UQ74NVM5Xjr1/K/lAHF\nj+oOCYxsc41eZ/AKy5+ieqaoG5CVz90Og8HywOgxaZgqnBo3NEpa7OkQ1DLD3LXz\nXrdJw8nPVvwsblUADZNpsrjaHKuJFznX/uoXmP/baQKBgQDfb3X1+ZG4TW8roUZp\nSinS298Qa7UjG2e1mZwT/9nuh29u9pG37qfTbO5IKroXLV7MJg4NBJp1vjMwYn+j\n47QcV4ZjNtLXTWS8OlF+U8oZ98Ttzffwxkm8uvQLp480tLemseVxnx/gZ3tbkn4A\nS820ZNdOb8pJvNnPtcogu+ZndQKBgQDEiRnyarLPW3ofUFE7vMrdvF7rkrc/zUa4\nSZmaoUbBn1tbtmEbJXAM/xJPxRVHioCX4tylRzNnjwN+L6aiYSz9NMfMWjyfDFv6\nREgjYUNnbOfD8L7PVXkxrL8nO87qd8egG05hKbY4vH1xQJkOYqPdw7F/kUazJTWs\nAw+nMFGeuQKBgFBsCRRpKQcicAJPQU3CkP1BgK+jZQZm5dRanvAf5ixR+U0CWP7Q\nWv3htn6pSmPvQ7DNfb83yfTZaglfWrv9yKVu54Msh4VRaRHLF+wVcqgYI3zI5xZ1\n+LKCxDaxr/zzkyrf20sjUFDwTlluiAXJQxhMN6cW28PgwrFdqIxRtaPFAoGAO3nm\nIUeK71eWoI1U2AgtOGc+LnpK/ILpyPF1C6eM2yGXqyyJPIba3wP+Daft5aWTfuOH\ntHjUpJ1SCEjxW6iezc3APSZ9vAAogZdSYWqY1F7P0Ks1g1cxgwftHTlrR+eRwPEi\niiLuY0MfjztmVkUhpAYJ3DohtCspj/GpNgZYXPkCgYBgRTq/mEThIHNHcmh5ez50\nAyjaK+/ibcsejY/WSEaME2W9nE8JfnoowWlDf2Y0o60IYLHqW648kIMHCvrEZHwg\nq7IUhloCZgTFA9al0napPM2FHA56JukCWGEomuoHs09nlJrfZR1Hd97HGzGralFR\nYa/OXvHoTpFDUN+dzU4LJA==\n-----END PRIVATE KEY-----\n',
//     },

//     projectId: process.env.GOOGLE_PROJECT_ID,
//     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
//   });

//   const client = await auth.getClient();
//   const accessToken = await client.getAccessToken();
//   return accessToken.token;
// }

// export async function POST(req: Request) {
//   try {
//     const {
//       userId = '1',
//       prompt,
//       n_samples,
//       cfg_scale,
//       seed,
//       num_inference_steps,
//       height,
//       width,
//       init_image,
//     } = await req.json();

//     // Validate incoming data
//     if (!prompt || !init_image || !height || !width) {
//       return NextResponse.json(
//         {
//           error: 'Invalid input',
//           details: 'Prompt, init_image, height, and width are required.',
//         },
//         { status: 400 }
//       );
//     }

//     // Process the initial image to ensure it's ready for the API
//     const processedInitImage = processInitImage(init_image);

//     const inputPayload = {
//       instances: [
//         {
//           text: prompt,
//         },
//       ],
//       parameters: {
//         height,
//         width,
//         num_inference_steps,
//         guidance_scale: cfg_scale,
//         init_image: processedInitImage, // Include processed init image
//       },
//     };

//     // Connect to MongoDB
//     const dbConnection = await connectToDB();
//     console.log('Database connection established:', dbConnection);

//     // Create a new request entry in the database
//     const newRequest = new Request({
//       userId,
//       prompt,
//       parameters: {
//         n_samples,
//         cfg_scale,
//         seed,
//         num_inference_steps,
//       },
//     });
//     const savedRequest = await newRequest.save();

//     // Get access token for Google API
//     const accessToken = await getAccessToken();
//     const endpoint = process.env.GOOGLE_ENDPOINT_URL;

//     if (!endpoint) {
//       Bugsnag.notify(new Error('GOOGLE_ENDPOINT_URL is not defined'));
//       return NextResponse.json(
//         {
//           error: 'Failed to generate image',
//           details: 'GOOGLE_ENDPOINT_URL is not defined',
//         },
//         { status: 500 }
//       );
//     }

//     const response = await fetch(endpoint, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(inputPayload),
//     });

//     if (!response.ok) {
//       const errorBody = await response.text();
//       Bugsnag.notify(new Error(`Image generation failed: ${errorBody}`));
//       return NextResponse.json(
//         { error: 'Failed to generate image', details: errorBody },
//         { status: 500 }
//       );
//     }

//     const responseBody = await response.json();
//     const generatedImage = responseBody.predictions[0].output;

//     // Update the request entry with the generated image output
//     savedRequest.output = generatedImage;
//     savedRequest.updatedAt = new Date();
//     await savedRequest.save();

//     // Return the generated image to the user
//     return NextResponse.json({ image: generatedImage });
//   } catch (error) {
//     console.error('Error during image generation:', error);
//     Bugsnag.notify(error as Error);
//     return NextResponse.json(
//       {
//         error: 'Failed to generate image',
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   }
// }
