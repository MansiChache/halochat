import { Databases, Query } from 'appwrite';
import { client } from '@/lib/appwrite-config';

// Configuration (replace with your Appwrite project details)
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;

const databases = new Databases(client);

export const GET = async (req, res) => {
  try {
    const allUsers = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID
    );

    return new Response(JSON.stringify(allUsers.documents), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to get all users", { status: 500 });
  }
};