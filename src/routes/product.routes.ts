import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getOneProduct,
    updateProduct
} from "@/controllers/product.controllers";
import { Router } from "express";

const router = Router();


// Routes for Products
router.post("/createProduct", createProduct)

router.get("/getAllProducts", getAllProducts)

router.get("/getOneProduct/:_id", getOneProduct)

router.delete("/deleteProduct/:_id", deleteProduct)

router.patch("/updateProduct/:_id", updateProduct)


export default router