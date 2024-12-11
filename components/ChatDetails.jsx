
// ChatDetails.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { account, databases, storage } from "@/lib/appwrite";
import Loader from "./Loader";
import { AddPhotoAlternate } from "@mui/icons-material";
import MessageBox from "./MessageBox";

const ChatDetails = ({ chatId }) => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  const getChatDetails = async () => {
    try {
      const chatDetails = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_CHATS_COLLECTION_ID,
        chatId
      );
      setChat(chatDetails);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  const sendText = async () => {
    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_MESSAGES_COLLECTION_ID,
        'unique()',
        {
          chatId,
          senderId: currentUser.$id,
          text,
          createdAt: new Date().toISOString()
        }
      );
      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  const sendPhoto = async (file) => {
    try {
      const uploadedFile = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        'unique()',
        file
      );

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_MESSAGES_COLLECTION_ID,
        'unique()',
        {
          chatId,
          senderId: currentUser.$id,
          photo: uploadedFile.$id,
          createdAt: new Date().toISOString()
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="pb-20">
      <div className="chat-details">
        {/* Similar structure to MongoDB version, 
            but use Appwrite's file and document retrieval methods */}
        <div className="send-message">
          <div className="prepare-message">
            <input
              type="file"
              onChange={(e) => sendPhoto(e.target.files[0])}
            />
            <input
              type="text"
              placeholder="Write a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button onClick={sendText}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;