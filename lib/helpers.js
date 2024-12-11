import { databases } from "./appwrite";

/**
 * Create a document in a given collection.
 * @param {string} databaseId - The database ID.
 * @param {string} collectionId - The collection ID.
 * @param {Object} data - The data to be stored in the document.
 * @returns {Promise<Object>} - The created document.
 */
export const createDocument = async (databaseId, collectionId, data) => {
  try {
    return await databases.createDocument(databaseId, collectionId, "unique()", data);
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

/**
 * Fetch a document by its ID from a given collection.
 * @param {string} databaseId - The database ID.
 * @param {string} collectionId - The collection ID.
 * @param {string} documentId - The document ID.
 * @returns {Promise<Object>} - The fetched document.
 */
export const getDocumentById = async (databaseId, collectionId, documentId) => {
  try {
    return await databases.getDocument(databaseId, collectionId, documentId);
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

/**
 * Update a document in a given collection.
 * @param {string} databaseId - The database ID.
 * @param {string} collectionId - The collection ID.
 * @param {string} documentId - The document ID.
 * @param {Object} data - The updated data.
 * @returns {Promise<Object>} - The updated document.
 */
export const updateDocument = async (databaseId, collectionId, documentId, data) => {
  try {
    return await databases.updateDocument(databaseId, collectionId, documentId, data);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

/**
 * Delete a document by its ID from a given collection.
 * @param {string} databaseId - The database ID.
 * @param {string} collectionId - The collection ID.
 * @param {string} documentId - The document ID.
 * @returns {Promise<void>} - Indicates successful deletion.
 */
export const deleteDocument = async (databaseId, collectionId, documentId) => {
  try {
    await databases.deleteDocument(databaseId, collectionId, documentId);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};
