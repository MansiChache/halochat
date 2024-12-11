import { Client, Databases } from "appwrite";
import { pusherServer } from "@lib/appwrite";

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

// Chat creation route
export const POST = async (req) => {
  try {
    const body = await req.json();
    const { currentUserId, members, isGroup, name, groupPhoto } = body;

    // Define Appwrite collection ID
    const CHAT_COLLECTION_ID = process.env.APPWRITE_CHAT_COLLECTION_ID;
    const USER_COLLECTION_ID = process.env.APPWRITE_USER_COLLECTION_ID;

    // Query to check if chat already exists (simplified for group and direct chat check)
    const chatQuery = isGroup
      ? { members: [currentUserId, ...members], isGroup, name, groupPhoto }
      : { members: [currentUserId, ...members] };

    // Fetch existing chat documents (group or direct)
    const chats = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      CHAT_COLLECTION_ID,
      [chatQuery]
    );

    let chat = chats.documents.length > 0 ? chats.documents[0] : null;

    if (!chat) {
      // Create a new chat
      chat = await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        CHAT_COLLECTION_ID,
        "unique()", // Use unique ID for chat document
        {
          members: [currentUserId, ...members],
          isGroup,
          name: isGroup ? name : undefined,
          groupPhoto: isGroup ? groupPhoto : undefined,
          createdAt: new Date().toISOString(),
        }
      );

      // Add the chat ID to each user's chat list (update users' chats)
      for (let memberId of chat.members) {
        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          USER_COLLECTION_ID,
          memberId,
          {
            $addToSet: { chats: chat.$id },
          }
        );
      }

      // Trigger a Pusher event for each member to notify a new chat
      chat.members.forEach(async (memberId) => {
        await pusherServer.trigger(memberId, "new-chat", chat);
      });
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to create a new chat", { status: 500 });
  }
};
