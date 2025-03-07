import React from "react";
import { X } from "lucide-react";
import { User } from "@/types";
import { cn } from "@/lib/utils";

interface UserBadgeItemProps {
  user: User;
  handleFunction: () => void;
  className?:string
}

const UserBadgeItem: React.FC<UserBadgeItemProps> = ({
  user,
  handleFunction,
  className
}) => {
  return (
    <div
      className={cn(
        "px-3 py-1 rounded-full cursor-pointer bg-sky-200 text-blue-800 hover:text-white border-1 flex items-center space-x-2 justify-center",
        className
      )}
      onClick={handleFunction}
    >
      {user.name} <X className="text-2xl" />
    </div>
  );
};

export default UserBadgeItem;
