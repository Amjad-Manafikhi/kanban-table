import { cookies } from 'next/headers'
import { decrypt } from "./session";
import { NextApiRequest } from 'next';
import { parse } from 'cookie';
export default async function apiAuth(req:NextApiRequest){


    const cookies = parse(req.headers.cookie || "");
    const session = cookies.session; // your encrypted token
    const sessionData = session? await decrypt(session):null;
    const userId = sessionData?.userId;
    if(userId) return true;
    return false


}