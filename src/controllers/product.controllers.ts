import { Request, Response } from 'express';
import { db } from "@/drizzle/db";
import { Product } from '@/drizzle/schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { IProduct } from '@/types';
import { ApiError } from '@/utils/ApiError';
import { eq } from 'drizzle-orm';


const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, category, price, size, description, quantity, image, priority } = req.body;
    try {
        if (!name || !category || !price || !size || !description || !quantity || !image || !priority) {
            throw new ApiError(400, "All required fields must be provided to create a product");
        }
        const [result] = await db.insert(Product).values({
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
        const [product]:IProduct[] = await db.select({
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

        return res
            .status(201)
            .json(new ApiResponse(201, product, "Product created successfully"));

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Internal Server Error")

    }
})

export { createProduct }