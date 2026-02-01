// Routes are responsible for handling the incoming requests
// and forwarding them to the appropriate controller.

import { Router } from "express";
import { registerHandler } from "../controllers/auth.controller";

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);

export default authRoutes;