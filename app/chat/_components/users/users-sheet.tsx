"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import ChatLoading from "../chat/ChatLoading";
import UserListItem from "./UserListItem";
import { toast } from "sonner";
import axios from "axios";
import { AuthUser, User } from "@/types";
import { useChatStore } from "@/hooks/useChatStore";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface UserSheetProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
  user: AuthUser;
}

const formSchema = z.object({
  search: z.string().min(1, "min of 1 character"),
});

type FormData = z.infer<typeof formSchema>;

const UserSheet: React.FC<UserSheetProps> = ({
  isSheetOpen,
  setIsSheetOpen,
  user,
}) => {
  const [searchResult, setSearchResult] = React.useState<User[]>([]);

  const { chats, setChats, setSelectedChat } = useChatStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/user?search=${values.search}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
      toast("Failed to load the search results");
    }
  };

  const accessChat = async (userId: string) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([...chats, data]);
      }

      setSelectedChat(data);
      setIsSheetOpen(false);
    } catch (error) {
      toast("Something went wrong");
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={(open) => setIsSheetOpen(open)}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Search Users</SheetTitle>
        </SheetHeader>
        <Separator className="my-2" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex-1 relative">
                  <div className="flex flex-col">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Search by name or email"
                        {...field}
                      />
                    </FormControl>
                    {/* FormMessage with absolute positioning */}
                    <FormMessage className="text-sm absolute top-full mt-1" />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                "Go"
              )}
            </Button>
          </form>
        </Form>
        {form.formState.isSubmitting ? (
          <ChatLoading />
        ) : (
          searchResult.map((user: User) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
