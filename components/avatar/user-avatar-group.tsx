import { User } from "@/types";
import React from "react";
import Image from "next/image";

interface UserAvatarGroupProps {
  users: User[];
}

const UserAvatarGroup: React.FC<UserAvatarGroupProps> = ({ users }) => {
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative border rounded-full  w-12 h-12">
      {users.slice(0, 3).map((user, index) => (
        <div
          key={user._id}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
            positionMap[index as keyof typeof positionMap]
          }`}
        >
          <Image
            alt="avatar"
            fill
            src={user.photoUrl || "/images/avatar.png"}
          />
        </div>
      ))}
    </div>
  );
};
//  src={
export default UserAvatarGroup;
