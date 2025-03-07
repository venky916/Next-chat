import React from "react";

import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/avatar/user-avatar";

interface UserListItemProps {
  user: User;
  handleFunction: (id: string) => void;
  className?: string;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  handleFunction,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-[#E8E8E8] hover:bg-[#38B2AC] hover:text-white w-full flex items-center text-black p-2 transition rounded-lg hover:cursor-pointer my-2 space-x-3",
        className
      )}
      onClick={() => handleFunction(user?._id)}
    >
      <UserAvatar user={user} />
      <div>
        <p>{user.name}</p>
        <p className="text-sm">
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
