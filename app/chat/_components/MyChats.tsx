"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useChatStore } from "@/hooks/useChatStore";
import { toast } from "sonner";
import axios from "axios";
import { AuthUser, Chat } from "@/types";
import ChatMessageItem from "./chat/chat-message-item";
import ChatLoading from "./chat/ChatLoading";
import useLocalStorage from "@/hooks/useLocalStorage";
import GroupChatModal from "./modals/GroupChatModal";
import useSocket from "@/hooks/useSocket";

const MyChats = () => {
  const { selectedChat, chats, setChats } = useChatStore();
  const [user] = useLocalStorage<AuthUser | null>("user", null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const socket = useSocket();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  const isUserOnline = (userId: string) => onlineUsers.includes(userId);

  useEffect(() => {
    if (!socket) return; // ✅ Prevent errors if socket is null

    socket.on("online-users", (users: string[]) => {
      // console.log(users);
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online-users"); // ✅ Clean up listener when component unmounts
    };
  }, [socket]);

  // console.log(onlineUsers);

  return (
    <>
      <div
        className={`${
          selectedChat ? "hidden" : "flex"
        } md:flex flex-col p-3  bg-white w-full  md:w-1/3 rounded-lg border-1 `}
      >
        <div className="pb-3 px-3 text-[25px] md:text-[28px] flex w-full justify-between items-center">
          My Chats
          <Button onClick={() => setIsGroupModalOpen(true)}>
            New Group Chat <Plus />
          </Button>
        </div>
        <div className="flex flex-col p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-y-hidden ">
          {chats ? (
            <div className="overflow-y-auto thin-scrollbar">
              {chats.map((chat: Chat) => (
                <ChatMessageItem
                  key={chat._id}
                  chat={chat}
                  user={user!}
                  isUserOnline={isUserOnline}
                />
              ))}
            </div>
          ) : (
            <ChatLoading />
          )}
        </div>
      </div>
      <GroupChatModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </>
  );
};

export default MyChats;
