import { Router } from "express";
import { registerUser } from "@/controllers/users/registerUser.controller";

const router = Router();

router.route("/register").post(registerUser);


export default router;