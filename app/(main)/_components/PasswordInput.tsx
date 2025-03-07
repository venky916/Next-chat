import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

interface PasswordInputProps {
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  showPassword,
  setShowPassword,
  value,
  onChange,
}) => {
  return (
    <div className="relative flex justify-between items-center">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter the password"
        value={value} // ✅ Pass value here
        onChange={onChange} // ✅ Pass onChange event handler
      />
      <Button
        type="button"
        className="absolute right-1 p-2 text-sm"
        onClick={() => setShowPassword(!showPassword)}
        size={"sm"}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 text-white" />
        ) : (
          <Eye className="h-5 w-5 text-white" />
        )}
      </Button>
    </div>
  );
};

export default PasswordInput;
