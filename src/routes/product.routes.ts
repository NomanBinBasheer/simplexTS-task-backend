import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    uploadProductImage
} from "@/controllers/product.controllers";
import { upload } from "@/middlewares/multer.middleware";
import { validateUserToken } from "@/middlewares/validateUser.middleware";

import { Router } from "express";

const router = Router();


// Routes for Products
router.route("/createProduct").post(validateUserToken, createProduct)

router.route("/uploadProductImage").post(upload.single("image"), validateUserToken, uploadProductImage)

router.route("/getAllProducts").get(validateUserToken, getAllProducts)

router.route("/getOneProduct/:_id").get(validateUserToken, getOneProduct)

router.route("/deleteProduct/:_id").delete(validateUserToken, deleteProduct)

router.route("/updateProduct/:_id").patch(validateUserToken, updateProduct)


export default router