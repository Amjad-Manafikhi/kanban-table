// import type { NextApiRequest } from "next";
// import type { NextApiResponseServerIO } from "@/types/next";
// import { initSocket } from "@/lib/socketServer";

// export const config = {
//   api: { bodyParser: false },
// };

// export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
//   if (!res?.socket?.server?.io) {
//     initSocket(res);
//   }
//   res.end();
// }
