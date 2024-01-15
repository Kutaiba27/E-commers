import { Router } from "express";

import {
   deleteProductValidator,
   getProductValidator,
   createpoductValidator,
   updateProductValidator
} from "../utility/validators/productValidation.js"

import {
   createProduct,
   deleteProduct,
   getProdects,
   getProduct,
   updateProduct,
   uploadPodactImage,
   resizingProductImage
} from "../services/productServices.js";

import { ReviewRouter } from "./reviewRoutes.js";
import { protect, allowTo } from "../services/authServices.js";

const router = Router()

router.use("/:productId/reviews", ReviewRouter)

router.route("/")
   .get(getProdects)
   .post(
      protect,
      allowTo("user", 'admin', 'manger'),
      uploadPodactImage,
      resizingProductImage,
      createpoductValidator,
      createProduct
   );

router.route("/:id")
   .get(getProductValidator, getProduct)
   .put(
      protect,
      allowTo('admin', 'manger'),
      updateProductValidator,
      updateProduct
   )
   .delete(
      protect,
      allowTo('manger'),
      deleteProductValidator,
      deleteProduct
   );

export { router as ProductRouter }