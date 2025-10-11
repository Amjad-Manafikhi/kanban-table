import { Server } from "socket.io";
import type { NextApiResponseServerIO } from "@/types/next";

export function initSocket(res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
    });
    res.socket.server.io = io;
  }
  return res.socket.server.io;
}
