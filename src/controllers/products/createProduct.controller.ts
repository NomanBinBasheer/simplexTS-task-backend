import { Request, Response } from 'express';
import { db } from "@/drizzle/db";
import { Product } from '@/drizzle/schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { eq } from 'drizzle-orm';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { IProduct } from '@/types';

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, category, price, size, description, quantity, image, priority } = req.body;
    try {
        if (!name || !category || !price || !size || !description || !quantity || !image || !priority) {
            throw new ApiError(400, "All required fields must be provided to create a product");
        }
        const [result]: MySqlRawQueryResult = await db.insert(Product).values({
            name,
            category,
            price,
            size,
            description,
            quantity,
            image,
            priority
        });

        const insertedId = result.insertId;


        // Fetch the inserted record
        const fetchedProducts: IProduct[] = await db.select({
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
            .where(eq(Product.id, insertedId))
            .limit(1);

        const product = fetchedProducts[0];
        if (!product) throw new ApiError(500, "Error creating user");

        return res
            .status(201)
            .json(new ApiResponse(201, product, "Product created successfully"));

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