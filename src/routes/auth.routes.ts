
import { Router } from "express";
import { login } from "@/controllers/auth/login.controller";

const router = Router();


// Declare routes
router.route("/login").post(login)

export default router