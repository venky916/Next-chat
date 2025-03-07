"use client";
import { useChatStore } from "@/hooks/useChatStore";
import { AuthUser, Chat } from "@/types";
import {
  formatDateWithOrdinal,
  getSenderId,
  getSenderName,
} from "@/utils";
import Image from "next/image";
import React from "react";

interface ChatMessageItemProps {
  chat: Chat;
  user: AuthUser;
  isUserOnline: (senderId: string) => boolean;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  chat,
  user,
  isUserOnline,
}) => {
  const { selectedChat, setSelectedChat } = useChatStore();

  const lastMessage = chat.latestMessage;
  const senderId = getSenderId(user, chat.users);
  const isOnline = !chat.isGroupChat && isUserOnline(senderId);

  return (
    <div
      onClick={() => setSelectedChat(chat)}
      className={`cursor-pointer my-2 px-3 py-2 rounded-lg ${
        selectedChat?._id === chat?._id
          ? "bg-[#38B2AC] text-white"
          : "bg-[#E8E8E8] text-black"
      }`}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-bold">
          {!chat.isGroupChat ? getSenderName(user, chat.users) : chat.chatName}
        </h1>
        {isOnline && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        <div className="flex gap-2">
          {lastMessage?.sender?._id === senderId &&
            lastMessage?.sender?.photoUrl && (
              <Image
                src={lastMessage?.sender?.photoUrl}
                alt="User Avatar"
                className="h-6 w-6 rounded-full mr-2"
                width={24}
                height={24}
              />
            )}

          <p className="text-sm truncate max-w-80">
            {lastMessage?.content || "Start the conversation"}
          </p>
        </div>
        {lastMessage?.createdAt && (
          <p
            className={`text-xs  mt-1  ${
              selectedChat?._id === chat?._id
                ? " text-gray-300"
                : " text-gray-500"
            }`}
          >
            {formatDateWithOrdinal(lastMessage?.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
