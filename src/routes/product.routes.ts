import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    uploadProductImage
} from "@/controllers/product.controllers";
import { upload } from "@/middlewares/multer.middleware";

import { Router } from "express";

const router = Router();


// Routes for Products
router.route("/createProduct").post(createProduct)

router.route("/uploadProductImage").post(upload.single("image"), uploadProductImage)

router.route("/getAllProducts").get(getAllProducts)

router.route("/getOneProduct/:_id").get(getOneProduct)

router.route("/deleteProduct/:_id").delete(deleteProduct)

router.route("/updateProduct/:_id").patch(updateProduct)


export default router