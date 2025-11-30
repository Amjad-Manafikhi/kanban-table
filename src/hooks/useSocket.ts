import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let socketInstance: Socket | null = null;

export function useSocket() {
  const [socket] = useState<Socket | null>(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        path: "/socket_io",
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      });
    }
    return socketInstance;
  });

  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setSocketId(socket.id ?? "");
      console.log("Connected:", socket.id);
    };

    const handleReconnect = (attempt: number) => {
      console.log("Reconnected after attempts:", attempt, "New id:", socket.id);
      setSocketId(socket.id ?? "");
    };

    const handleDisconnect = (reason: string) => {
      console.log("Disconnected:", reason);
    };

    socket.on("connect", handleConnect);
    socket.on("reconnect", handleReconnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("reconnect", handleReconnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  return { socket, socketId };
}
