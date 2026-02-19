// Routes are responsible for handling the incoming requests
// and forwarding them to the appropriate controller.

import { Router } from "express";
import { emailVerifyHandler, loginHandler, logoutHandler, refreshHandler, registerHandler, sendPasswordResetHandler } from "../controllers/auth.controller";

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", emailVerifyHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);

export default authRoutes;