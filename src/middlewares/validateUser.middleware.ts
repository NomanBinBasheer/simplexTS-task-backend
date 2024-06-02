import type { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/utils/asyncHandler";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { User } from "@/drizzle/schema";
import { ApiResponse } from "@/utils/ApiResponse";
import { IUser, IUserForFE } from "@/types";


export const validateUserToken = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response, next: NextFunction) => {
      // Get access token from either cookie or request header and replace "Bearer " from token from header to get only token string
      const token = req.header("Authorization")?.replace("Bearer ", "");
    try {

      // If token is not provided, throw an error
      if (!token) {
        throw new ApiError(401, "Unauthorized Request");
      }
      // Verify the token
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string,
      );

      // If token is verified successfully, decodedToken will have the type of the payload provided when signing the token
      let userId: string | undefined;
      if (typeof decodedToken === "string") {
        userId = decodedToken;
      } else {
        userId = (decodedToken as JwtPayload).userId as string;
      }

      // If userId is not found, throw an error
      if (!userId) {
        throw new ApiError(401, "Invalid access token");
      }

      // Checking if user exists
      const [user]: IUser[] = await db
        .select()
        .from(User)
        .where(eq(User.id, Number(userId)));
        

      // If user is not found, throw an error
      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      // Add found user to the request object
      req.user = user;
      next();
      
    } catch (error: any) {
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
  },
);
