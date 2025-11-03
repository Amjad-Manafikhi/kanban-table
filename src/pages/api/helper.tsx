  
  
  
  export function emitExceptSender({ io, socketId, event, data }: any) {
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
