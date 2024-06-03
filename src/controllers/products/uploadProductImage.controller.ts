import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { UploadApiResponse } from 'cloudinary';
import { uploadOnCloudinary } from '@/utils/cloudinary';
import { sendError } from '@/utils/sendError';


export const uploadProductImage = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    try {

        // checking if File is provided
        if (!file) {
            throw new ApiError(400, "File must be provided");
        }

        // uploading image to cloudinary using uploadOnCloudinary utility function
        const uploadedFileResponse: UploadApiResponse = await uploadOnCloudinary(
            file.path,
        );

        return res
            .status(201)
            .json(new ApiResponse(201, uploadedFileResponse.url, "Image uploaded successfully"));

    } catch (error) {
        return sendError(res, error);
    }
})