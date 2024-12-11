import { Client, Databases } from "appwrite";

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

export const GET = async (req) => {
  try {
    // Define Appwrite collection IDs
    const USER_COLLECTION_ID = process.env.APPWRITE_USER_COLLECTION_ID;

    // Fetch all users from the Appwrite database
    const users = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      USER_COLLECTION_ID
    );

    return new Response(JSON.stringify(users.documents), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to get all users", { status: 500 });
  }
};
