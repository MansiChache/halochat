import { Databases, Query } from 'appwrite';
import { client } from '@/lib/appwrite-config';

// Configuration (replace with your Appwrite project details)
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;

const databases = new Databases(client);

export const GET = async (req, { params }) => {
  try {
    const { query } = params;

    const searchedContacts = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [
        Query.or(
          Query.search('username', query),
          Query.search('email', query)
        )
      ]
    );

    return new Response(JSON.stringify(searchedContacts.documents), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to search contact", { status: 500 });
  }
};