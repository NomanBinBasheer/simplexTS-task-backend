import { ApiError } from "./ApiError";
import { Request, Response } from 'express';
import { ApiResponse } from "./ApiResponse";

export const sendError = (res: Response, error: any) => {
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