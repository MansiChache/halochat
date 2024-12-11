import { Databases, ID, Query } from 'appwrite';
import { client } from '@/lib/appwrite-config'; // Adjust the import path as needed

// Initialize Databases
const databases = new Databases(client);

// Configuration (you'll want to replace these with your actual Appwrite project details)
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const CHATS_COLLECTION_ID = process.env.APPWRITE_CHATS_COLLECTION_ID;
const MESSAGES_COLLECTION_ID = process.env.APPWRITE_MESSAGES_COLLECTION_ID;
const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;

export const GET = async (req, { params }) => {
  try {
    const { chatId } = params;

    // Fetch chat details
    const chat = await databases.getDocument(
      DATABASE_ID,
      CHATS_COLLECTION_ID,
      chatId
    );

    // Fetch members (users in the chat)
    const membersPromises = chat.members.map(memberId => 
      databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, memberId)
    );
    const members = await Promise.all(membersPromises);

    // Fetch messages for this chat
    const messagesResponse = await databases.listDocuments(
      DATABASE_ID,
      MESSAGES_COLLECTION_ID,
      [
        Query.equal('chat', chatId),
        Query.orderAsc('$createdAt')
      ]
    );

    // Fetch sender and seen by details for each message
    const messagesWithDetails = await Promise.all(
      messagesResponse.documents.map(async (message) => {
        const sender = await databases.getDocument(
          DATABASE_ID, 
          USERS_COLLECTION_ID, 
          message.sender
        );

        const seenByPromises = message.seenBy.map(userId => 
          databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId)
        );
        const seenBy = await Promise.all(seenByPromises);

        return {
          ...message,
          sender,
          seenBy
        };
      })
    );

    // Construct the response object
    const chatDetails = {
      ...chat,
      members,
      messages: messagesWithDetails
    };

    return new Response(JSON.stringify(chatDetails), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to get chat details", { status: 500 });
  }
};

export const POST = async (req, { params }) => {
  try {
    const { chatId } = params;
    const body = await req.json();
    const { currentUserId } = body;

    // Fetch all messages for this chat
    const messagesResponse = await databases.listDocuments(
      DATABASE_ID,
      MESSAGES_COLLECTION_ID,
      [Query.equal('chat', chatId)]
    );

    // Update each message to add the current user to seenBy
    const updatePromises = messagesResponse.documents.map(message => {
      // Ensure no duplicate entries in seenBy
      const updatedSeenBy = message.seenBy.includes(currentUserId) 
        ? message.seenBy 
        : [...message.seenBy, currentUserId];

      return databases.updateDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        message.$id,
        {
          seenBy: updatedSeenBy
        }
      );
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    return new Response("Seen all messages by current user", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to update seen messages", { status: 500 });
  }
};