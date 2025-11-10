import { useEffect, useRef, useState } from "react";
import { useMouseShare } from "../hooks/useMouseShare";
import { BsCursorFill } from "react-icons/bs";
export default function LiveMouseBoard() {
    const [userId, setUserId] = useState<number>();
    
  

  useEffect(() => {
      async function getUser() {
        try {
          const res = await fetch( "/api/auth/me", {
            credentials: "include",
          });
          if (!res.ok) return;
          const data: number = await res.json();
          setUserId(data);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      }
      getUser();
    }, []);


  const { otherCursors } = useMouseShare(userId);
  const colors = [
        "#4A90E2", // Blue (Primary)
        "#50E3C2", // Mint Green (Cyan/Teal)
        "#F5A623", // Gold/Orange (Warning)
        "#BD10E0", // Vivid Purple
        "#FF69B4", // Hot Pink
        "#7ED321", // Lime Green (Success)
        "#9013FE", // Deep Indigo
        "#4A4A4A"  // Dark Gray (Neutral)
        ];      
  const color = useRef(colors[Math.floor(Math.random() * 9)]);

  return (
    <div className=" relative z-100 " id="mouseBoard">
      {Object.entries(otherCursors).map(([id, { x, y, firstName }]) =>
        (x > 0 && y > 0) ? (
          <div
            key={id}
            className="absolute flex flex-col z-100"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          >

            <BsCursorFill
              key={id}
              className=" w-5 h-5 rotate-270"
              style={{ color:color.current}}
            />
            <div className="  rounded-sm px-2 "
              style={{ backgroundColor:color.current}}
            >{firstName}</div>
          </div>
        ) : null
      )}
    </div>

  );
}
