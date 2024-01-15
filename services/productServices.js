
import { v4 as uuidV4 } from "uuid";
import sharp from "sharp";
import asyncHandler from 'express-async-handler'

import { ProductModel } from "../models/productModel.js";
import { uploadMulityImage } from '../middlewares/uploadImageMiddlewares.js'
import { deleteItem, updateItem, createItem, getItem, getAll } from './handerFactory.js'

export const resizingProductImage = asyncHandler( async (req, res, next)=>{

   if(req.files.imageCovered[0]){
      const imageCoveredNamed = `product-${uuidV4()}-${Date.now()}-covered.jpeg`

      await sharp(req.files.imageCovered[0].buffer)
         . resize(1200, 1333)
         .toFormat("jpeg")
         .jpeg({quality: 90})
         .toFile(`uploads/products/${imageCoveredNamed}`)
      req.body.imageCovered = imageCoveredNamed;
   }
   
   if(req.files.images){
      req.body.images = []
      await Promise.all(
      req.files.images.map(async (image)=>{
         const imagesName = `product-${uuidV4()}-${Date.now()}.jpeg`
         await sharp(image.buffer)
         . resize(1200, 1333)
         .toFormat("jpeg")
         .jpeg({quality: 90})
         .toFile(`uploads/products/${imagesName}`)
         req.body.images.push(imagesName)
      }))
   }
   next()
})

export const uploadPodactImage = uploadMulityImage([{name: "imageCovered", maxCount: 1 }, {name: "images", maxCount: 6}])

export const createProduct = createItem(ProductModel)

export const getProdects = getAll(ProductModel, "Product")

export const getProduct = getItem(ProductModel, {path: "reviews"})

export const updateProduct = updateItem(ProductModel)

export const deleteProduct = deleteItem(ProductModel)









