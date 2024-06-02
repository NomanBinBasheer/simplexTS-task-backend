import { Request, Response } from 'express';
import { db } from "@/drizzle/db";
import { Product } from '@/drizzle/schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { IProduct } from '@/types';
import { ApiError } from '@/utils/ApiError';
import { eq } from 'drizzle-orm';

export const getOneProduct = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.params;
    try {
        // checking if ID is provided
        if (!_id) {
            throw new ApiError(400, "ID must be provided to fetch a product");
        }

        const productId = Number(_id);
        if (isNaN(productId)) {
            throw new ApiError(400, "ID must be a valid number");
        }

        const [product]:IProduct[] = await db
            .select({
                id: Product.id,
                name: Product.name,
                category: Product.category,
                price: Product.price,
                size: Product.size,
                description: Product.description,
                quantity: Product.quantity,
                image: Product.image,
                priority: Product.priority
            })
            .from(Product)
            .where(eq(Product.id, productId))
            .limit(1);

        return res
            .status(200)
            .json(new ApiResponse(200, product, "Products fetched successfully"));
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