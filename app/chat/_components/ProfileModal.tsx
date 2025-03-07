import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types";
import Image from "next/image";
import React from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="dialog-description">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-4xl">{user?.name}</DialogTitle>
          <DialogDescription id="dialog-description">
            <Image
              src={user?.photoUrl}
              alt={user?.name}
              className="rounded-full h-40 w-40"
              width={200}
              height={200}
            />
            <p className="my-1">
              Email: <span className="font-bold text-black">{user?.email}</span>
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end  bg-gray-100 px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
