import type { NextApiRequest } from "next";
import { initSocket } from "@/lib/socketServer";
import type { NextApiResponseServerIO } from "@/types/next";

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = initSocket(res);
    io.on("connection", socket => {
      console.log("Client connected:", socket.id);
      socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
    });
  }
  res.end();
}
