import { Server } from "socket.io";
import type { NextApiResponseServerIO } from "@/types/next";
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export function initSocket(res: NextApiResponseServerIO) {
  const server = res.socket.server as HTTPServer & { io?: SocketIOServer };
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
