import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance: Socket = io(process.env.NEXT_PUBLIC_URL); // Backend URL
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
