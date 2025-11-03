import { Server } from "socket.io";
import type { NextApiResponseServerIO } from "@/types/next";

export function initSocket(res: NextApiResponseServerIO) {
  const server = res.socket.server as any;
  console.log("Existing io:", !!server.io);

  // prevent re-initialization
  if (server.io) {
    return server.io;
  }

  console.log("🚀 Initializing Socket.IO server...");

  const io = new Server(server, {
    path: "/api/socket_io",
    addTrailingSlash: false,
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("mouse-move", (data) => {
      socket.broadcast.emit("mouse-update", data);
      
    });
    socket.on("mouse-leave", (data) => {
      socket.broadcast.emit("user-disconnected", data);
      
    });

    socket.on("disconnect", () => {
      io.emit("user-disconnected", socket.id);
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  server.io = io;
  return io;
}
