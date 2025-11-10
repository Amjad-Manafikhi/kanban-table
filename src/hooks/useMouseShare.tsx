import { useLayoutContext } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

// Single socket instance
let socket: Socket | null = null;

export function useMouseShare(userId: number|undefined) {
  const [otherCursors, setOtherCursors] = useState<Record<string, { x: number; y: number, firstName:string }>>({});
  const { firstName } = useLayoutContext();
  console.log(firstName,"name")
  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        path: "/api/socket_io",
        transports: ["websocket"], // force WebSocket
      });
    }

    
  const table = document.querySelector<HTMLDivElement>("#kanban-table");;
  const handleMouseMove = (e: MouseEvent) => {
    if (!table) return;

    const rect = table.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!inside){
      socket?.emit("mouse-leave", userId);
      return;
    } // don’t emit if outside
    socket?.emit("mouse-move", {
      userId,
      x: e.clientX - rect.left + table.scrollLeft,
      y: e.clientY - rect.top + table.scrollTop,
      firstName:firstName
    });
  };

    
    

    window.addEventListener("mousemove", handleMouseMove);

    socket.on("mouse-update", (data) => {
      setOtherCursors((prev) => ({
        ...prev,
        [data.userId]: { x: data.x, y: data.y, firstName: data.firstName },
      }));
    });

    

    // socket.on("mouse-delete", (userId) => {
    //   console.log("deleted",userId)
    //   setOtherCursors((prev) => {
    //     const newState = { ...prev };
    //     delete newState[userId];
    //     return newState;
    //   });
    // });

    socket.on("user-disconnected", (id) => {
      setOtherCursors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Do NOT disconnect socket here; keep it global
    };
  }, [userId]);

  return { otherCursors };
}
