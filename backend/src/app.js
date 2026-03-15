import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

connectDB();

app.use(express.json());

app.use("/api", routes);
app.use(errorMiddleware);

export default app;