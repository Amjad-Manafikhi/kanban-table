import { Task, Task_types } from "@/models/database";
import { DefaultEventsMap, Server } from "socket.io";

type Props = {
  io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
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
  
  
  export function emitExceptSender({ io, socketId, event, data }: Props) {
    console.log("emitExceptSender called with socketId:", socketId);
    console.log("Connected sockets:", Array.from(io.sockets.sockets.keys()));

    const senderSocket = io.sockets.sockets.get(socketId);

    if (senderSocket) {
      console.log(`Broadcasting (excluding sender ${socketId})`);
      senderSocket.broadcast.emit(event, data);
    } else {
      console.log("No sender found, using io.emit()");
      io.emit(event, data);
    }
  }
