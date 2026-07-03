import http from "http";
import app from "./src/app.js";
import { initSocket } from "./src/socketManager.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
// initialize socket.io on the HTTP server
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
