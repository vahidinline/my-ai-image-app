import { NextRequest, NextResponse } from 'next/server';

// Define the Cloudflare translation API endpoint and token
const TRANSLATE_API_URL =
  'https://api.cloudflare.com/client/v4/accounts/cf5dee87c7cc61fe6d56f5c69aee0df1/ai/run/@cf/meta/m2m100-1.2b';
const BEARER_TOKEN = 'rS30eFNMng4sXitawdFUn4rTb3rkwJy1ZbQF9-dA';

// This function handles POST requests to /api/translate
export async function POST(req: NextRequest) {
  try {
    const { text, target_lang } = await req.json();

    if (!text || !target_lang) {
      return NextResponse.json(
        { error: 'Text and target_lang are required.' },
        { status: 400 }
      );
    }

    const response = await fetch(TRANSLATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify({ text, target_lang }),
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: 'Translation failed.', details: data.errors },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
