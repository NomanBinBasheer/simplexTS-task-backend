import { Request, Response } from 'express';
import { db } from "@/drizzle/db";
import { Product } from '@/drizzle/schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { IProduct } from '@/types';
import { ApiError } from '@/utils/ApiError';
import { eq } from 'drizzle-orm';
import { sendError } from '@/utils/sendError';

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    try {

        // fetching all products from db using db.select()
        const products: IProduct[] = await db
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
            .where(eq(Product.isDeleted, false)).orderBy(Product.priority);

        return res
            .status(200)
            .json(new ApiResponse(200, products, "Products fetched successfully"));
    } catch (error) {
        return sendError(res, error);
    }
})