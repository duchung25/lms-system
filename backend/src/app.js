import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app = express();

connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173",
      "http://192.168.111.18:5173",], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", routes);

app.use(errorMiddleware);


export default app;