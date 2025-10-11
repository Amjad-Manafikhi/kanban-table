import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect once on mount
    const socket = io(SOCKET_URL, {
      path: "/api/socket_io",
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
}
