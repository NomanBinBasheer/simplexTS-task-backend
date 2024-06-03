import { Request, Response } from 'express';
import { db } from "@/drizzle/db";
import { Product } from '@/drizzle/schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { eq } from 'drizzle-orm';
import { sendError } from '@/utils/sendError';


export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.params;
    try {
        // checking if ID is provided
        if (!_id) {
            throw new ApiError(400, "ID must be provided to delete a product");
        }

        const productId = Number(_id);
        if (isNaN(productId)) {
            throw new ApiError(400, "ID must be a valid number");
        }

        await db
            .update(Product)
            .set({ isDeleted: true })
            .where(eq(Product.id, productId));

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Product deleted successfully"));
    }
    catch (error) {
        return sendError(res, error);
    }

})