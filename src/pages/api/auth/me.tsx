import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { decrypt } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || "");
  const session = cookies.session; // your encrypted token
  const data= session? await decrypt(session):null;

  res.status(200).json( data?.userId);
}
