// ChatList.jsx
"use client";

import { useState, useEffect } from "react";
import { account, databases } from "@/lib/appwrite";
import ChatBox from "./ChatBox";
import Loader from "./Loader";

const ChatList = ({ currentChatId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

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

  const getChats = async () => {
    try {
      // Adjust the query based on Appwrite's database querying
      const chatResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_CHATS_COLLECTION_ID,
        search ? [`members.userId=${currentUser.$id}`, `search=${search}`] : [`members.userId=${currentUser.$id}`]
      );

      setChats(chatResponse.documents);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input
        placeholder="Search chat..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chats">
        {chats?.map((chat, index) => (
          <ChatBox
            key={chat.$id}
            chat={chat}
            index={index}
            currentUser={currentUser}
            currentChatId={currentChatId}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;