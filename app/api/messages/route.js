import { Client, Databases } from "appwrite";
import { pusherServer } from "@lib/appwrite";

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { chatId, currentUserId, text, photo } = body;

    // Define Appwrite collection IDs
    const CHAT_COLLECTION_ID = process.env.APPWRITE_CHAT_COLLECTION_ID;
    const MESSAGE_COLLECTION_ID = process.env.APPWRITE_MESSAGE_COLLECTION_ID;
    const USER_COLLECTION_ID = process.env.APPWRITE_USER_COLLECTION_ID;

    // Fetch currentUser from Appwrite
    const currentUser = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      USER_COLLECTION_ID,
      currentUserId
    );

    // Create new message
    const newMessage = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      MESSAGE_COLLECTION_ID,
      "unique()", // Generate unique message ID
      {
        chatId,
        sender: currentUserId,
        text,
        photo,
        seenBy: [currentUserId],
        createdAt: new Date().toISOString(),
      }
    );

    // Update the chat with the new message and last message timestamp
    const updatedChat = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      CHAT_COLLECTION_ID,
      chatId,
      {
        $push: { messages: newMessage.$id }, // Add new message ID to messages array
        $set: { lastMessageAt: newMessage.createdAt }, // Update the last message timestamp
      }
    );

    // Trigger Pusher event for new message in the chat
    await pusherServer.trigger(chatId, "new-message", newMessage);

    // Trigger Pusher event for each member to update the chat with the latest message
    const chatMembers = updatedChat.members;
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    chatMembers.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (err) {
        console.error(`Failed to trigger update-chat event for member ${member._id}`);
      }
    });

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to create new message", { status: 500 });
  }
};
