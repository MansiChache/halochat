"use client"

import { useState, useEffect } from 'react';
import { account } from "@/lib/appwrite-config";

const Provider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };

    checkUser();
  }, []);

  return (
    <AppwriteContext.Provider value={{ user, setUser }}>
      {children}
    </AppwriteContext.Provider>
  );
};

export default Provider;