import { io } from "socket.io-client";

let socket = null;

const getSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem("accessToken") || null;
  const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

  socket = io(url, {
    auth: {
      token,
    },
    // optional: allow reconnection
    reconnection: true,
  });

  return socket;
};

export default getSocket;
