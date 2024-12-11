import { databases } from "../lib/appwrite";

const databaseId = "[YOUR_DATABASE_ID]";
const collectionId = "chats";

/**
 * Create a new chat document.
 * @param {Object} data - Data for the chat document.
 * @returns {Promise<Object>} - The created chat document.
 */
export const createChat = async (data) => {
  try {
    return await databases.createDocument(databaseId, collectionId, "unique()", {
      members: data.members || [],
      messages: data.messages || [],
      isGroup: data.isGroup || false,
      name: data.name || "",
      groupPhoto: data.groupPhoto || "",
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

/**
 * Get a chat document by ID.
 * @param {string} chatId - The ID of the chat document.
 * @returns {Promise<Object>} - The fetched chat document.
 */
export const getChatById = async (chatId) => {
  try {
    return await databases.getDocument(databaseId, collectionId, chatId);
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    throw error;
  }
};

/**
 * Update a chat document.
 * @param {string} chatId - The ID of the chat document.
 * @param {Object} data - Updated data for the chat document.
 * @returns {Promise<Object>} - The updated chat document.
 */
export const updateChat = async (chatId, data) => {
  try {
    return await databases.updateDocument(databaseId, collectionId, chatId, data);
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
};

/**
 * Delete a chat document by ID.
 * @param {string} chatId - The ID of the chat document.
 * @returns {Promise<void>} - Indicates successful deletion.
 */
export const deleteChat = async (chatId) => {
  try {
    await databases.deleteDocument(databaseId, collectionId, chatId);
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};
