import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { User } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { and } from 'drizzle-orm';
import { ApiResponse } from '@/utils/ApiResponse';
import { sendError } from '@/utils/sendError';


export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // checking if user with provided email exists in DB
        const [user] = await db
            .select()
            .from(User)
            .where(and(
                eq(User.email, email),
                eq(User.isDeleted, false)
            ));
        if (!user) {
            throw new ApiError(404, "User with this email does not exist");
        }

        // Checking if password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(401, "Invalid email or password");
        }

        // If password is correct, generate access token
        const payload = { userId: user.id };

        const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "30d",
        });

        return res
            .status(200)
            .json(new ApiResponse(200, { token }, "User Login Successful"));

    } catch (error) {
        return sendError(res, error);
    }
})
