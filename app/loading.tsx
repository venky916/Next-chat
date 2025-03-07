import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl font-semibold text-white flex items-center">
        <Loader className="animate-spin text-4xl mr-2" />
        Loading...
      </p>
    </div>
  );
}
