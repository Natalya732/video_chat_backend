import express from "express";

import { handleGoogleLogin, getCurrentUser } from "./userServices.js";
import { authenticateUserMiddleware } from "./userMiddleware.js";

const router = express.Router();

router.post("/user/google-login", handleGoogleLogin);
router.get("/user/me", authenticateUserMiddleware, getCurrentUser);

export default router;
