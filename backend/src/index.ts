// this is the entry point of our application
import cors from "cors";
import "dotenv/config";
import express from "express";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";

const app = express();

// this just allows our Express server to parse JSON request
// bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true
  })
);
app.use(cookieParser());



app.listen(
  4004,
  async () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    await connectToDatabase();
  }
);