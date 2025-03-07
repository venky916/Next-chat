"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/hooks/useChatStore";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AuthUser, User } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Loader } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { debounce } from "lodash";
import UserBadgeItem from "../users/UserBadgeItem";
import UserListItem from "../users/UserListItem";

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the User schema
const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  photoUrl: z.string().url(),
  createdAt: z.string(), // Assuming it's an ISO date string
  updatedAt: z.string(), // Assuming it's an ISO date string
  password: z.string().optional(), // Optional field
  __v: z.number().optional(), // Optional field
});

// Define the form schema
const formSchema = z.object({
  groupChatName: z.string().min(4, "Minimum of 4 characters required"),
  search: z.string(),
  selectedUsers: z.array(userSchema), // Array of User objects
  searchResults: z.array(userSchema), // Array of User objects
});

type FormData = z.infer<typeof formSchema>;

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose }) => {
  const [user] = useLocalStorage<AuthUser | null>("user", null);
  const { chats, setChats } = useChatStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupChatName: "",
      search: "",
      selectedUsers: [],
      searchResults: [],
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const [loading, setLoading] = useState(false);
  const searchQuery = watch("search");

  // Debounced API call function
  const fetchUsers = debounce(async (query: string) => {
    if (query.length < 2) {
      setValue("searchResults", []); // Clear results if the query is too short
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
        `${process.env.NEXT_PUBLIC_URL}/api/user?search=${query}`,
        config
      );
      setLoading(false);
      setValue("searchResults", data); // Update searchResults in the form
    } catch (error) {
      console.log(error)
      setLoading(false);
      toast.error("Failed to load search results");
    }
  }, 300); // 300ms debounce delay

  // Trigger API call when searchQuery changes
  useEffect(() => {
    fetchUsers(searchQuery);
  }, [searchQuery]);

  const handleGroup = (user: User) => {
    const selectedUsers = form.getValues("selectedUsers");
    if (selectedUsers.some((u) => u._id === user._id)) {
      toast.warning("User already added");
      return;
    }
    const updatedUsers = [...selectedUsers, user];
    setValue("selectedUsers", updatedUsers);
  };

  const handleDelete = (user: User) => {
    const updatedUsers = form
      .getValues("selectedUsers")
      .filter((u) => u._id !== user._id);
    setValue("selectedUsers", updatedUsers);
  };

  const onSubmit = async (data: FormData) => {
    if (!data.groupChatName || data.selectedUsers.length === 0) {
      toast.warning("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data: response } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/chat/group`,
        {
          name: data.groupChatName,
          users: data.selectedUsers.map((u) => u._id),
        },
        config
      );

      setChats([response, ...chats]);
      form.reset();
      onClose();
      toast.success("New group chat created");
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong");
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent aria-describedby="dialog-description">
        <DialogHeader className="flex justify-center items-center m-5">
          <DialogTitle className="text-4xl font-workSans">
            Create Group Chat
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            {/* Chat Name Input */}
            <FormField
              control={control}
              name="groupChatName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chat Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter a name for your group chat"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage>{errors.groupChatName?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Add Users Input */}
            <FormField
              control={control}
              name="search"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Add Users</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Search users by name, e.g., John, Piyush, Jane"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage>{errors.search?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Selected Users Badges */}
            <div className="flex flex-wrap mt-2 gap-1">
              {form.watch("selectedUsers").map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </div>

            {/* Search Results */}
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <Loader className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {form
                  .watch("searchResults")
                  ?.slice(0, 3)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 justify-end w-fit"
            >
              {isSubmitting ? "Creating..." : "Create Group Chat"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatModal;
