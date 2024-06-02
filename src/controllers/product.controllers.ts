import { Request, Response } from 'express';
import { db } from "@/drizzle/db";
import { Product } from '@/drizzle/schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { IProduct } from '@/types';
import { ApiError } from '@/utils/ApiError';
import { eq } from 'drizzle-orm';
import { UploadApiResponse } from 'cloudinary';
import { uploadOnCloudinary } from '@/utils/cloudinary';


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

        console.log(result);
        

        const insertedId = result.insertId;


        // Fetch the inserted record
        const [product]: any = await db.select({
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

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    try {
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

const getOneProduct = asyncHandler(async (req: Request, res: Response) => {
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

        const [product]: any = await db
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

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
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

        const insertedId = result.insertId;

        const [product]: any = await db
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
            
            console.log(result);
            console.log(product);
            
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

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
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

        const [result] = await db
            .update(Product)
            .set({ isDeleted: true })
            .where(eq(Product.id, productId));

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Product deleted successfully"));
    }
    catch (error) {
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

const uploadProductImage = asyncHandler(async (req: Request, res: Response) => {
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

export {
    createProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
}