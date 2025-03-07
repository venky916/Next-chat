"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/hooks/useChatStore";
import useLocalStorage from "@/hooks/useLocalStorage";
import useSocket from "@/hooks/useSocket";
import { AuthUser, Message } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CircleChevronRight } from "lucide-react";
import React, {  useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  message: z.string().min(1, "min of 1 character"),
});

type FormData = z.infer<typeof formSchema>;

import { Dispatch, SetStateAction } from "react";

interface ChatMessageFormProps {
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const ChatMessageForm: React.FC<ChatMessageFormProps> = ({ setMessages }) => {
  const [user, ] = useLocalStorage<AuthUser | null>("user", null);
  const { selectedChat } = useChatStore();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const socket = useSocket();
  const [typing, setTyping] = useState(false);

  const onSubmit = async (values: FormData) => {
    try {
      socket?.emit("stop typing", selectedChat?._id);
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/message`,
        {
          content: values.message,
          chatId: selectedChat,
        },
        config
      );
      setMessages((prevMessages: Message[]) => [...prevMessages, data]); // Add the new message

      socket?.emit("new message", data); // Emit to other users

      form.reset();
    } catch (error) {
      console.log(error)
      toast.error("Error Occur");
    }
  };

  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("message", e.target.value);

    if (!socket) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id,user?._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000; // 3 seconds

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat?._id,user?._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-center space-x-2"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1 relative">
                <div className="flex flex-col">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter a message.."
                      className="bg-white text-black"
                      {...field}
                      onChange={typingHandler}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <CircleChevronRight className="h-7 w-7" />
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ChatMessageForm;
