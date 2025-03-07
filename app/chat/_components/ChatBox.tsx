"use client";
import React from "react";
import SingleChat from "./SingleChat";
import { useChatStore } from "@/hooks/useChatStore";

const ChatBox = () => {
  const {selectedChat}= useChatStore();
  return (
    <div
      className={`${
        selectedChat ? "flex " : "hidden"
      } md:flex flex-col w-full md:w-2/3  items-center rounded-lg border-1 p-2 bg-white  `}
    >
      <SingleChat />
    </div>
  );
};

export default ChatBox;
