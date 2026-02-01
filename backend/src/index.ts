// this is the entry point of our application
import cors from "cors";
import "dotenv/config";
import express from "express";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth.route";

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

app.use("/auth", authRoutes);

app.use(errorHandler);


app.listen(
  PORT,
  async () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    await connectToDatabase();
  }
);