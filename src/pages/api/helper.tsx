import { Task, Task_types } from "@/models/database";
import { DefaultEventsMap, Server } from "socket.io";

type Props = {
  socketId:string;
  event:string;
  data:{
    element?:Task | Task_types;
    id?:string;
  }|{
    activeId:string;
    overId:string;
  }|Task | Task_types

}
  
  
  export async function emitExceptSender({ socketId, event, data }: Props) {
  // const res = await fetch("http://localhost:3001/")
  // const data2=await res.json();

  const res = await fetch('http://localhost:3001/', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
        socketId,
        event,
        data,
        }),
  });
  

    // console.log("emitExceptSender called with socketId:", socketId);
    // console.log("Connected sockets:", Array.from(io.sockets.sockets.keys()));

    // const senderSocket = io.sockets.sockets.get(socketId);

    // if (senderSocket) {
    //   console.log(`Broadcasting (excluding sender ${socketId})`);
    //   senderSocket.broadcast.emit(event, data);
    // } else {
    //   console.log("No sender found, using io.emit()");
    //   io.emit(event, data);
    // }
  }
