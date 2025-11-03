import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster/>
      <Component {...pageProps} />
      

    </>
  );
  }


const socket = io({ path: "/api/socket_io" });

export function useSocket() {
  useEffect(() => {
    socket.on("connect", () => console.log("connected"));
    return () => { socket.disconnect(); };
  }, []);
  return socket;
}

