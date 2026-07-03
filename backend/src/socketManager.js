import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io = null;

export function initSocket(server) {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authenticate socket connections using JWT sent in handshake auth.token
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) return next(new Error("Not authorized"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch (err) {
      return next(new Error("Not authorized"));
    }
  });

  io.on("connection", (socket) => {
    // join and leave rooms by lessonId
    socket.on("join_lesson", (lessonId) => {
      if (!lessonId) return;
      socket.join(String(lessonId));
    });

    socket.on("leave_lesson", (lessonId) => {
      if (!lessonId) return;
      socket.leave(String(lessonId));
    });

    socket.on("disconnect", () => {
      // no-op, rooms are cleaned up automatically
    });
  });

  return io;
}

export function getIo() {
  return io;
}
