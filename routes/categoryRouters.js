import { Router } from "express";

import {
	getCategoriesValidator,
	createCategoryValidator,
	deleteCategoriesValidator,
	updateCategoriesValidator
} from "../utility/validators/categoryValidation.js"

import {
	createCategory,
	getCategories,
	getCategory,
	updateCategory,
	deletCategory,
	uploadCategoryImages,
	resizingCategoryImage
} from "../services/categoryServices.js";

import { protect, allowTo } from "../services/authServices.js";

import { SubCategoryRouter } from "./subCategoryRouters.js"

const router = Router()

router.use("/:categoryId/subcategory", SubCategoryRouter)

router.route("/")
	.get(getCategories)
	.post(
		protect,
		allowTo('admin', 'manger'),
		uploadCategoryImages,
		resizingCategoryImage,
		createCategoryValidator,
		createCategory
	);

router.route("/:id")
	.get(getCategoriesValidator, getCategory)
	.put(
		protect,
		allowTo('admin', 'manger'),
		uploadCategoryImages,
		resizingCategoryImage,
		updateCategoriesValidator,
		updateCategory
	)
	.delete(
				protect, 
				allowTo('manger'), 
				deleteCategoriesValidator, 
				deletCategory
				);

export { router as CategoryRouter }