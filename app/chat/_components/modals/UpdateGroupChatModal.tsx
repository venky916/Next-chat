"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChatStore } from "@/hooks/useChatStore";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { AuthUser, User } from "@/types";
import UserBadgeItem from "../users/UserBadgeItem";
import UserListItem from "../users/UserListItem";

interface UpdateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchMessages: () => void;
}

const UpdateGroupChatModal: React.FC<UpdateGroupChatModalProps> = ({
  isOpen,
  onClose,
  fetchMessages,
}) => {
  const { selectedChat, setSelectedChat } = useChatStore();
  const [groupChatName, setGroupChatName] = useState<string>(
    selectedChat?.chatName as string
  );
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setRenameLoading] = useState(false);
  const [user] = useLocalStorage<AuthUser | null>("user", null);

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/api/chat/rename`,
        {
          chatId: selectedChat?._id,
          chatName: groupChatName,
        },
        config
      );
      // console.log(data._id);
      setSelectedChat(data);
      //   setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName(data.chatName);
    } catch (error) {
      console.log(error)
      toast.error("Error Occurred");
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearch(query.trim());
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/user?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error)
      toast.error("Error Occurred");
      setLoading(false);
    }
  };

  const handleAddUser = async (addingUser: User) => {
    if (selectedChat?.users.find((u) => u._id === addingUser._id)) {
      toast.warning("User Already in group!");
      return;
    }
    if (selectedChat?.groupAdmin._id !== user?._id) {
      toast.warning("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/api/chat/group-add`,
        {
          chatId: selectedChat?._id,
          userId: addingUser._id,
        },
        config
      );

      setSelectedChat(data);
      //   setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error)
      toast.error("error occurred");
      setLoading(false);
    }
  };

  const handleRemove = async (removingUser: User) => {
    if (selectedChat?.groupAdmin._id !== user?._id) {
      toast.error("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/api/chat/group-remove`,
        {
          chatId: selectedChat?._id,
          userId: removingUser._id,
        },
        config
      );
      removingUser._id === user?._id
        ? setSelectedChat(null)
        : setSelectedChat(data);
      //   setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error("Error Occurred");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchResult([]);
    setSearch("");
    setGroupChatName(selectedChat?.chatName!);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">
            {selectedChat?.chatName}
            <h1 className="flex justify-start font-normal text-lg">
              Admin:
              <span className=" ml-2 font-bold text-sky-400">
                {selectedChat?.groupAdmin?.name}
              </span>
            </h1>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="w-full flex flex-wrap gap-1 mt-2">
            {selectedChat &&
              selectedChat?.users &&
              selectedChat?.users.map(
                (u) =>
                  u?._id !== user?._id && (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleRemove(u)}
                    />
                  )
              )}
          </div>
          <div className="flex w-full  items-center space-x-2 mt-2">
            <Input
              type="text"
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button type="button" onClick={handleRename}>
              Update
            </Button>
          </div>
          <Input
            type="text"
            placeholder="Add User to group"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="p-4 mt-2"
          />
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : (
            searchResult
              .slice(0, 3)
              ?.map((user: User) => (
                <UserListItem
                  key={user?._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                  className="my-1 p-1"
                />
              ))
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            onClick={() => handleRemove(user as User)}
            className="bg-red-500 disabled:hover:cursor-not-allowed"
            disabled={selectedChat?.groupAdmin?._id !== user?._id}
          >
            Leave Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGroupChatModal;
