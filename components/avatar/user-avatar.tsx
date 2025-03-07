import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@/types";

interface UserAvatarProps {
  user: User;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  return (
    <Avatar>
      <AvatarImage
        src={user.photoUrl}
        alt={user.name}
        className="cursor-pointer rounded-sm mr-1 "
      />
      <AvatarFallback>{user.name}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
