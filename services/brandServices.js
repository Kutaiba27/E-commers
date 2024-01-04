import { v4 as uuidV4 } from 'uuid'
import sharp from 'sharp'
import asyncHandler from 'express-async-handler'

import { uploadSingleImage } from '../middlewares/uploadImageMiddlewares.js'
import { BrandModel } from "../models/brandModel.js" 
import { deleteItem, updateItem, createItem, getItem, getAll } from './handerFactory.js'

export const uploadBrandImages = uploadSingleImage("image")

export const resizingBrandImage = asyncHandler( async (req, res, next)=>{

   const filename = `brand-${uuidV4()}-${Date.now()}.jpeg`

   await sharp(req.file.buffer)
      . resize(600, 600)
      .toFormat("jpeg")
      .jpeg({quality: 90})
      .toFile(`uploads/brand/${filename}`)
   req.body.image = filename;
      next();
})

export const createBrand = createItem(BrandModel)

export const getBrands = getAll(BrandModel)

export const getBrand = getItem(BrandModel)

export const updateBrand = updateItem(BrandModel)

export const deleteBrand = deleteItem(BrandModel)

