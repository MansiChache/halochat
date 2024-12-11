import { databases } from "../lib/appwrite";

const databaseId = "[YOUR_DATABASE_ID]";
const collectionId = "users";

/**
 * Create a new user document.
 * @param {Object} data - Data for the user document.
 * @returns {Promise<Object>} - The created user document.
 */
export const createUser = async (data) => {
  try {
    return await databases.createDocument(databaseId, collectionId, "unique()", {
      username: data.username,
      email: data.email,
      password: data.password, // Use a secure method to hash passwords before storing.
      profileImage: data.profileImage || "",
      chats: data.chats || [],
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Get a user document by ID.
 * @param {string} userId - The ID of the user document.
 * @returns {Promise<Object>} - The fetched user document.
 */
export const getUserById = async (userId) => {
  try {
    return await databases.getDocument(databaseId, collectionId, userId);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

/**
 * Update a user document.
 * @param {string} userId - The ID of the user document.
 * @param {Object} data - Updated data for the user document.
 * @returns {Promise<Object>} - The updated user document.
 */
export const updateUser = async (userId, data) => {
  try {
    return await databases.updateDocument(databaseId, collectionId, userId, data);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Delete a user document by ID.
 * @param {string} userId - The ID of the user document.
 * @returns {Promise<void>} - Indicates successful deletion.
 */
export const deleteUser = async (userId) => {
  try {
    await databases.deleteDocument(databaseId, collectionId, userId);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
