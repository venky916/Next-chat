"use client";
import { useChatStore } from "@/hooks/useChatStore";
import React, { useEffect, useState } from "react";
import { Eye, ArrowLeft, Loader2 } from "lucide-react";
import { getSenderName, getSender } from "@/utils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AuthUser, Message } from "@/types";
import axios from "axios";
import { toast } from "sonner";
import ScrollableChat from "./ScrollableChat";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./modals/UpdateGroupChatModal";
import ChatMessageForm from "./chat/chat-message-form";
import useSocket from "@/hooks/useSocket";
import animationData from "@/animations/typing.json";
import Lottie from "react-lottie";
import UserAvatar from "@/components/avatar/user-avatar";
import UserAvatarGroup from "@/components/avatar/user-avatar-group";

const SingleChat = () => {
  const [user, setUser] = useLocalStorage<AuthUser | null>("user", null);
  const { selectedChat, setSelectedChat, notifications, setNotifications } =
    useChatStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGroupModal, setIsGroupModal] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const [socketConnected, setSockedConnected] = useState(false);

  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket?.emit("join chat", selectedChat?._id);
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    if (!socket) return; // Prevent running if socket is null
    socket.emit("setup", user);
    socket.on("connected", () => setSockedConnected(true));
    socket.on("typing", (senderId) => {
      if (senderId !== user?._id) {
        setIsTyping(true);
      }
    });
    socket.on("stop typing", (senderId) => {
      if (senderId !== user?._id) {
        setIsTyping(false);
      }
    });
    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket, user?._id]);

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

 useEffect(() => {
   if (!socket) return;

   const messageListener = (newMessageReceived: Message) => {
     if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
       setNotifications((prevNotifications) => {
         // Remove any existing notification from the same chat
         const filteredNotifications = prevNotifications.filter(
           (n) => n.chat._id !== newMessageReceived.chat._id
         );

         // Add the new notification at the beginning
         return [newMessageReceived, ...filteredNotifications];
       });
     } else {
       setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
     }
   };

   socket.on("message received", messageListener);

   return () => {
     socket.off("message received", messageListener);
   };
 }, [socket, selectedChat, setNotifications]);


  console.log(notifications)

  return (
    <>
      {selectedChat ? (
        <>
          <div className="text-[24px] md:test-[30px] px-2 pb-3 w-full flex justify-between items-center">
            <ArrowLeft
              className="flex md:hidden cursor-pointer"
              onClick={() => setSelectedChat(null)}
            />
            {selectedChat.isGroupChat ? (
              <>
                <div className="flex items-center gap-2">
                  <UserAvatarGroup users={selectedChat?.users} />
                  {selectedChat.chatName.toUpperCase()}
                </div>

                <Eye
                  onClick={() => setIsGroupModal(true)}
                  className="cursor-pointer"
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <UserAvatar user={getSender(user!, selectedChat.users)} />
                  {getSenderName(user!, selectedChat.users).toUpperCase()}
                </div>
                <Eye
                  onClick={() => setIsProfileOpen(true)}
                  className="cursor-pointer"
                />
              </>
            )}
          </div>
          <div className="relative flex flex-col justify-end p-3 bg-[#E8E8E8] w-full h-full rounded-lg overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-gray-500 text-4xl" />
              </div>
            ) : (
              <div className="flex flex-col overflow-y-auto thin-scrollbar">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping && (
              <div className="mr-auto mt-2">
                <Lottie width={70} options={defaultOptions} />
              </div>
            )}
            <ChatMessageForm setMessages={setMessages} />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-3xl pb-3 tracking-wide">
            Click on a USER to start chatting
          </p>
        </div>
      )}
      {selectedChat && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={getSender(user as AuthUser, selectedChat?.users)}
        />
      )}
      <UpdateGroupChatModal
        isOpen={isGroupModal}
        onClose={() => setIsGroupModal(false)}
        fetchMessages={fetchMessages}
      />
    </>
  );
};

export default SingleChat;
