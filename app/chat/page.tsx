"use client"
import dynamic from "next/dynamic";

const ChatBox = dynamic(() => import("./_components/ChatBox"), { ssr: false });
const MyChats = dynamic(() => import("./_components/MyChats"), { ssr: false });

import React, { useEffect, useState } from "react";
import Navbar from "./_components/Navbar";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Loader } from "lucide-react";

const ChatPage =() => {
  const [user, ] = useLocalStorage("user", null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); 
  }, []);

  useEffect(() => {
    if (isClient && !user) {
      router.replace("/");
    }

  }, [isClient, user, router]);

   if (!isClient) {
     return (
       <div className="flex items-center justify-center h-screen">
         <p className="text-2xl font-semibold text-white flex items-center"> <Loader className="animate-spin text-4xl mr-2"/>Loading...</p>
       </div>
     );
   }

  return (
    <div>
      <Navbar />
      <div className="flex justify-between gap-2 w-full h-[91.5vh] p-3">
        <MyChats />
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;
