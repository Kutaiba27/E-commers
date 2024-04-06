import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { v4 as uuidV4 } from "uuid"

import { CategoryModel } from "../models/categoryModel.js";
import { deleteItem, updateItem, createItem, getItem, getAll } from './handerFactory.js'
import { uploadSingleImage } from "../middlewares/uploadImageMiddlewares.js"

export const uploadCategoryImages = uploadSingleImage("image")

export const resizingCategoryImage = asyncHandler( async (req, res, next)=>{

   const filename = `category-${uuidV4()}-${Date.now()}.jpeg`

   await sharp(req.file.buffer)
      . resize(600, 600)
      .toFormat("jpeg")
      .jpeg({quality: 90})
      .toFile(`uploads/category/${filename}`)
   req.body.image = filename;
      next();
})

export const createCategory = createItem(CategoryModel)

export const getCategories = getAll(CategoryModel)

export const getCategory = getItem(CategoryModel)

export const updateCategory = updateItem(CategoryModel)

export const deletCategory = deleteItem(CategoryModel)









