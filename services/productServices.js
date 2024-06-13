
import { v4 as uuidV4 } from "uuid";
import sharp from "sharp";
import asyncHandler from 'express-async-handler'
import { ProductModel } from "../models/productModel.js";
import { uploadMulityImage } from '../middlewares/uploadImageMiddlewares.js'
import { deleteItem, updateItem, createItem, getItem, getAll } from './handerFactory.js'
import { ApiFeatures } from "../utility/apiFeatures.js";
import { RepositoryModel } from "../models/repoModel.js";

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

export const getProdects = getAll(RepositoryModel, "Product")

export const getProduct = getItem(ProductModel, {path: "repoInfo"}, "-repoInfo.totalQuantity")

export const updateProduct = updateItem(ProductModel)

export const deleteProduct = deleteItem(ProductModel)

export const search = async(req,res)=>{
   let query ={};
   query.$or = [
      {title: {$regex: req.body.keyword, $options: 'i'}},
      {description: {$regex: req.body.keyword, $options: 'i'}}
   ];
   const {mongooseQuery, qurier} = new ApiFeatures(ProductModel.find(),req.body).search('Product')
   console.log(await mongooseQuery.exec());
   console.log(qurier);
   const product = await ProductModel.find(query)
   res.json({product})
}

export const getProdectsnew = asyncHandler( async (req, res)=>{
   let query = JSON.stringify(req.query)
   query = query.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
   query = JSON.parse(query)
   console.log(query)
   const products = await RepositoryModel.aggregate([
      {$match: { price: { $gt: 300 } }},
      {$lookup: {
         from: "products",
         localField: "productId",
         foreignField: "_id",
         as: "product"
      }}
   ])
   res.json(products)
})






