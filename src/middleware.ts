import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/", "/companies"]
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookies = req?.cookies.get("session");
    // your encrypted token
    //const sessionData = cookies? await decrypt(cookies?.value):null;
    const session = cookies?.value;


    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isPublicRoute && session) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();


}