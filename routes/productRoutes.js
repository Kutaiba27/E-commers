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
   resizingProductImage,
   search,
   getProdectsnew
} from "../services/productServices.js";

import { ReviewRouter } from "./reviewRoutes.js";
import { protect, allowTo } from "../services/authServices.js";

const router = Router()
router.get('/getProdectsnew',getProdectsnew)
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

router.get('/search',search)

router.route("/:id")
   .get(getProductValidator, getProduct)
   .put(
      protect,
      allowTo('admin', 'manger','user'),
      updateProductValidator,
      updateProduct
   )
   .delete(
      protect,
      // allowTo('manger'),
      deleteProductValidator,
      deleteProduct
   );   

export { router as ProductRouter }