import { Request, Response } from 'express';
import { db } from "@/drizzle/db";
import { Product } from '@/drizzle/schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { IProduct } from '@/types';
import { ApiError } from '@/utils/ApiError';
import { eq } from 'drizzle-orm';


export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.params;
    const { name, category, price, size, description, quantity, image, priority } = req.body;
    try {
        // checking if ID is provided
        if (!_id) {
            throw new ApiError(400, "ID must be provided to update a product");
        }

        if (!name && !category && !price && !size && !description && !quantity && !image && !priority) {
            throw new ApiError(400, "Must provide at least one field that needs to be changed");
        }

        const productId = Number(_id);
        if (isNaN(productId)) {
            throw new ApiError(400, "ID must be a valid number");
        }

        const [result] = await db
            .update(Product)
            .set({
                name,
                category,
                price,
                size,
                description,
                quantity,
                image,
                priority
            })
            .where(eq(Product.id, productId));

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
            .json(new ApiResponse(200, product, "Product updated successfully"));
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