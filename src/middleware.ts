import { parse } from "cookie";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/", "/mytasks", "/companies"]
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req:NextRequest){
 
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookies = req.cookies.get("loggedIn")?.value
    console.log(cookies,"cookie");
    
    
    if(isProtectedRoute && !cookies) {
        return NextResponse.redirect(new URL("/login",req.nextUrl));
    }

    if(isPublicRoute && cookies) {
        return NextResponse.redirect(new URL("/",req.nextUrl));
    }

    return NextResponse.next();


}