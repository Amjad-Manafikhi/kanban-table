import { Task, Task_types } from "@/types/database";

type Props = {
  socketId: string;
  event: string;
  data: {
    element?: Task | Task_types;
    id?: string;
  } | {
    activeId: string;
    overId: string;
  } | Task | Task_types |
  {
    [k: string]: {
      type_id: string;
      idx: number;
    };
  }

}
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001/"


export async function emitExceptSender({ socketId, event, data }: Props) {
  // const res = await fetch("http://localhost:3001/")
  // const data2=await res.json();
  console.log(event);
  try {

    const res = await fetch(SOCKET_URL, {
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


    if (res.ok) {
        console.log('update sent to server');
    } else {
        console.error('failed to send updates to server');
    }
  }catch(error){
    console.error(`Error updating for users in real time:`, error);
  }


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
