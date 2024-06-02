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
import hashPassword from '@/utils/hashPassword';
import { IUser, IUserForFE } from '@/types/user';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';


const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            throw new ApiError(400, "All required fields must be provided");
        }

        // checking if user with this email already exists in DB
        const duplicateUser: IUser[] = await db
            .select()
            .from(User)
            .where(eq(User.email, email));

        if (duplicateUser.length > 0) {
            throw new ApiError(
                400,
                "This email or username has already been used to register a user",
            );
        }

        // Hashing the password
        const hashedPassword = await hashPassword(password);

        // Checking if password was hashed successfully
        if (!hashedPassword) throw new ApiError(500, "Error hashing password");

        // Inserting user into DB
        const [user]: MySqlRawQueryResult = await db
            .insert(User)
            .values({ name, email, password: hashedPassword })

        const insertedId = user?.insertId;

        // Fetching the inserted user
        const [createdUser]: IUserForFE[] = await db
            .select({
                id: User.id,
                name: User.name,
                email: User.email
            })
            .from(User)
            .where(eq(User.id, insertedId))

        const payload = { userId: createdUser?.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "10d",
        });


        return res
            .status(200)
            .json(new ApiResponse(200, {createdUser, token}, "User created successfully"));

    } catch (error) {
        if (error instanceof ApiError) {
            return res
                .status(error.statusCode)
                .json(new ApiResponse(error.statusCode, null, error.message));
        }
        console.error(error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Internal Server Error"));
    }
})

export {registerUser}