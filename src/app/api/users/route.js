// app/api/users/route.ts
import { NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import User from '@/models/users'; // Import your mongoose model

export async function GET() {
  try {
    await connectToDB(); // Connect to MongoDB

    const users = await User.find(); // Fetch users from the DB

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return new NextResponse('Failed to fetch users', { status: 500 });
  }
}
