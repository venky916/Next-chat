import { AuthUser, Chat, Message } from "@/types";
import { SetStateAction } from "react";
import { create } from "zustand";

interface ChatStore {
  user: AuthUser | null;
  selectedChat: Chat | null;
  chats: Chat[];
  notifications: Message[];

  setUser: (user: AuthUser) => void;
  setSelectedChat: (selectedChat: Chat | null) => void;
  setChats: (chats: Chat[]) => void;
  setNotifications: (notifications: SetStateAction<Message[]>) => void; // Update the type
}

export const useChatStore = create<ChatStore>((set) => ({
  user: null,
  selectedChat: null,
  chats: [],
  notifications: [],
  setUser: (user) => set({ user }),
  setSelectedChat: (selectedChat) => set({ selectedChat }),
  setChats: (chats) => set({ chats }),
  setNotifications: (notifications) =>
    set((state) => ({
      notifications:
        typeof notifications === "function"
          ? notifications(state.notifications) // Handle functional updates
          : notifications, // Handle direct updates
    })),
}));
