
import { Router } from "express";

import {
   createBrand,
   getBrands,
   getBrand,
   deleteBrand,
   updateBrand,
   resizingBrandImage,
   uploadBrandImages
} from "../services/brandServices.js"

import {
   createBrandValidator,
   getBrandValidator,
   deleteBrandValidator,
   updateBrandValidator
} from "../utility/validators/brandValidation.js"

import { protect, allowTo } from "../services/authServices.js";

const router = Router({ mergeParams: true });

router.route('/')
   .get(protect, getBrands)
   .post(
      protect,
      allowTo('admin', 'manger','user'),
      uploadBrandImages,
      resizingBrandImage,
      createBrandValidator,
      createBrand
   );

router.route('/:id')
   .get(getBrandValidator, getBrand)
   .put(
      protect,
		allowTo('admin', 'manger'),
      uploadBrandImages, 
      resizingBrandImage, 
      updateBrandValidator, 
      updateBrand
      )
   .delete(
      protect,
		allowTo('manger'),
      deleteBrandValidator, 
      deleteBrand
      );


export { router as BrandRouter }