"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import NotificationBadge from "./chat/NotificationBadge";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ProfileModal from "./ProfileModal";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AuthUser, User } from "@/types";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/hooks/useChatStore";
import { getInitials, getSenderName } from "@/utils";
import UserSheet from "./users/users-sheet";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const router = useRouter();
  const [user, setUser] = useLocalStorage<AuthUser | null>("user", null);

  const logoutHandler = () => {
    setUser(null);
    router.replace("/");
  };

  const { notifications, setSelectedChat, setNotifications } = useChatStore();

  return (
    <div className="flex justify-between items-center bg-white w-full px-1 py-2 border-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
              <Search /> <p className="hidden md:block"> Search User</p>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search Users to chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <h1 className="text-2xl font-workSans">Let's Chat</h1>
      <div className="flex items-center space-x-1">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <NotificationBadge count={notifications.length} />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                {!notifications.length && "No New Messages"}
              </MenubarItem>
              {notifications.map((notify) => (
                <React.Fragment key={notify._id}>
                  <MenubarItem
                    key={notify._id}
                    onClick={() => {
                      setSelectedChat(notify.chat);
                      setNotifications(
                        notifications.filter((n) => n !== notify)
                      );
                    }}
                  >
                    {notify.chat.isGroupChat
                      ? `New Message in ${notify?.chat?.chatName}`
                      : `New Message from ${getSenderName(
                          user!,
                          notify.chat.users
                        )}`}
                  </MenubarItem>
                  <MenubarSeparator />
                </React.Fragment>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Menubar className="overflow-hidden ">
          <MenubarMenu>
            <MenubarTrigger className="p-6 cursor-pointer">
              <Avatar>
                <AvatarImage src={user?.photoUrl} />
                <AvatarFallback>
                  {getInitials(user?.name as string)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="absolute right-2" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setIsProfileOpen(true)}>
                Profile
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={logoutHandler}>Logout</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user as AuthUser}
      />
      <UserSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        user={user as AuthUser}
      />
    </div>
  );
};

export default Navbar;
