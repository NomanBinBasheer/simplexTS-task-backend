import { login } from "@/controllers/auth.controllers";

import { Router } from "express";

const router = Router();


// Declare routes
router.route("/login").post(login)

export default router