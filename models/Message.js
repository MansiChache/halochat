import { databases } from "../lib/appwrite";

const databaseId = "[YOUR_DATABASE_ID]";
const collectionId = "messages";

/**
 * Create a new message document.
 * @param {Object} data - Data for the message document.
 * @returns {Promise<Object>} - The created message document.
 */
export const createMessage = async (data) => {
  try {
    return await databases.createDocument(databaseId, collectionId, "unique()", {
      chat: data.chat,
      sender: data.sender,
      text: data.text || "",
      photo: data.photo || "",
      createdAt: new Date().toISOString(),
      seenBy: data.seenBy || [],
    });
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

/**
 * Get a message document by ID.
 * @param {string} messageId - The ID of the message document.
 * @returns {Promise<Object>} - The fetched message document.
 */
export const getMessageById = async (messageId) => {
  try {
    return await databases.getDocument(databaseId, collectionId, messageId);
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    throw error;
  }
};

/**
 * Update a message document.
 * @param {string} messageId - The ID of the message document.
 * @param {Object} data - Updated data for the message document.
 * @returns {Promise<Object>} - The updated message document.
 */
export const updateMessage = async (messageId, data) => {
  try {
    return await databases.updateDocument(databaseId, collectionId, messageId, data);
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
};

/**
 * Delete a message document by ID.
 * @param {string} messageId - The ID of the message document.
 * @returns {Promise<void>} - Indicates successful deletion.
 */
export const deleteMessage = async (messageId) => {
  try {
    await databases.deleteDocument(databaseId, collectionId, messageId);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};
