import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AuthUser, Message } from "@/types";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "@/utils";
import { format } from "date-fns";
import React, { useEffect, useRef } from "react";

interface ScrollableChatProps {
  messages: Message[];
}

// {
//   isLastMessage(messages, idx, user?._id!) && (
//     <div className="flex items-center gap-2">
//       <p>{user?.name}</p>
//       <p>{format(new Date(msg?.createdAt), "p")}</p>
//     </div>
//   );
// }

const ScrollableChat: React.FC<ScrollableChatProps> = ({ messages }) => {
  const [user] = useLocalStorage<AuthUser | null>("user", null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      {messages &&
        messages.map((msg, idx) => (
          <div key={msg._id} className="flex my-1">
            {isSameSender(messages, msg, idx, user?._id!) ||
            isLastMessage(messages, idx, user?._id!) ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar>
                      <AvatarImage
                        src={msg.sender.photoUrl}
                        alt={msg.sender.name}
                        className="cursor-pointer rounded-sm mr-1"
                      />
                      <AvatarFallback>{msg.sender.name}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-white bg-transparent">
                      {msg.sender.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="mr-10" />
            )}
            <span
              className={`
                ${
                  msg.sender._id === user?._id ? "bg-[#bee3f8]" : "bg-[#b9f5d0]"
                } 
              rounded-full  px-2 py-2  max-w-sm mr-1 
               ml-${isSameSenderMargin(messages, msg, idx, user?._id!)} 
               mt-[${isSameUser(messages, msg, idx) ? 3 : 10}]`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      <div ref={bottomRef} /> {/* Invisible div at the bottom */}
    </div>
  );
};

export default ScrollableChat;
