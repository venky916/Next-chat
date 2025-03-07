import React from "react";
import { Bell } from "lucide-react";

const NotificationBadge = ({ count }: { count: number }) => {
  return (
    <strong className="relative inline-flex items-center rounded   px-2.5 py-1.5 text-xs font-medium cursor-pointer">
      {count > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 flex justify-center items-center items">
          <span className="text-white">{count}</span>
        </span>
      )}
      <span>
        <Bell />
      </span>
    </strong>
  );
};

export default NotificationBadge;
