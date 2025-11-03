import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ;

let socketInstance: Socket | null = null;

export function useSocket() {
  const [socket] = useState<Socket | null>(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        path: "/api/socket_io",
        transports: ["websocket"],
      });
    }
    return socketInstance;
  });

  const [socketId, setSocketId] = useState<string | null>(socket?.id ?? null);
  console.log("userId",socketId);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setSocketId(socket.id ?? "");
      console.log("🔌 Connected:", socket.id);
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket]);

  return { socket, socketId };
}
