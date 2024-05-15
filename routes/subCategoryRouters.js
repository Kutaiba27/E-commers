import { Router } from "express";

import {
   createSubCategory,
   getSubCategories,
   getSubCategory,
   deleteSubCategory,
   updateSubCategory,
   setCategoryIdToBody,
   createFilterObj
} from "../services/subCategoryServices.js"

import {
   createSubCategoryValidator,
   deleteSubCategoryValidator,
   getSubCategoryValidator,
   updateSubCategoryValidator
} from "../utility/validators/subCategoryValidation.js"

import { protect, allowTo } from "../services/authServices.js";

const router = Router({ mergeParams: true });

router.route('/')
   .get(createFilterObj,getSubCategories)
   .post(
      protect,
		allowTo('admin', 'manger'),
      setCategoryIdToBody,
      createSubCategoryValidator, 
      createSubCategory
      );

router.route('/:id')
   .get(getSubCategoryValidator, getSubCategory)
   .put(
      protect,
		allowTo('admin', 'manger'),
      updateSubCategoryValidator, 
      updateSubCategory
      )
   .delete(
      protect,
		allowTo('admin', 'manger'),
      deleteSubCategoryValidator, 
      deleteSubCategory
      );


export { router as SubCategoryRouter }