import { useEffect, useState } from "react";
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

  return (
    <div className="z-100">
      {Object.entries(otherCursors).map(([id, { x, y }]) =>
        (x > 0 && y > 0) ? (
          <BsCursorFill
            key={id}
            className="absolute w-5 h-5 z-100"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          />
        ) : null
      )}
    </div>

  );
}
