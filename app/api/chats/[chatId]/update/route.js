import { NextResponse } from 'next/server';
import { account } from '@/lib/appwrite-config';

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, profileImage } = body;

    // Update user preferences
    await account.updatePrefs({
      username,
      profileImage: profileImage || '/assets/person.jpg'
    });

    // Update account name
    await account.updateName(username);

    return NextResponse.json(
      { message: 'Profile updated successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' }, 
      { status: 500 }
    );
  }
}