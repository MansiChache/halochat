import { Databases, Query } from 'appwrite';
import { client } from '@/lib/appwrite-config';

// Configuration (replace with your Appwrite project details)
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const CHATS_COLLECTION_ID = process.env.APPWRITE_CHATS_COLLECTION_ID;
const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;
const MESSAGES_COLLECTION_ID = process.env.APPWRITE_MESSAGES_COLLECTION_ID;

const databases = new Databases(client);

export const GET = async (req, { params }) => {
  try {
    const { userId, query } = params;

    // Find chats where user is a member and chat name matches query
    const chatsResponse = await databases.listDocuments(
      DATABASE_ID,
      CHATS_COLLECTION_ID,
      [
        Query.contains('members', userId),
        Query.search('name', query)
      ]
    );

    // Fetch detailed information for each chat
    const searchedChats = await Promise.all(
      chatsResponse.documents.map(async (chat) => {
        // Fetch members details
        const membersPromises = chat.members.map(memberId => 
          databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, memberId)
        );
        const members = await Promise.all(membersPromises);

        // Fetch messages details
        const messagesResponse = await databases.listDocuments(
          DATABASE_ID, 
          MESSAGES_COLLECTION_ID,
          [Query.equal('chat', chat.$id)]
        );

        // Fetch sender and seenBy details for each message
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

        return {
          ...chat,
          members,
          messages: messagesWithDetails
        };
      })
    );

    return new Response(JSON.stringify(searchedChats), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to search chat", { status: 500 });
  }
};