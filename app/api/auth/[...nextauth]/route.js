import { NextResponse } from 'next/server';
import { account, databases } from '@/lib/appwrite-config';
import { ID } from 'appwrite';
import bcrypt from 'bcryptjs';

// Authentication route for registration and login
export async function POST(req) {
  try {
    const body = await req.json();
    const { type } = body;

    if (type === 'register') {
      const { username, email, password } = body;

      // Check if user already exists
      try {
        await account.get();
        return NextResponse.json(
          { error: 'User already exists' }, 
          { status: 400 }
        );
      } catch {
        // User doesn't exist, proceed with registration
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in Appwrite
        const user = await account.create(
          ID.unique(), 
          email, 
          hashedPassword, 
          username
        );

        // Store additional user info in user preferences
        await account.updatePrefs({
          username,
          profileImage: '/assets/person.jpg'
        });

        return NextResponse.json(user, { status: 200 });
      }
    }

    if (type === 'login') {
      const { email, password } = body;

      try {
        // Create email session
        const session = await account.createEmailPasswordSession(email, password);
        return NextResponse.json(session, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid credentials' }, 
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid request type' }, 
      { status: 400 }
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' }, 
      { status: 500 }
    );
  }
}