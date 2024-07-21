
import { v4 as uuidV4 } from "uuid";
import sharp from "sharp";
import asyncHandler from 'express-async-handler'
import { ProductModel } from "../models/productModel.js";
import { uploadMulityImage } from '../middlewares/uploadImageMiddlewares.js'
import { deleteItem, updateItem, getAll } from './handerFactory.js'
import { ApiFeatures } from "../utility/apiFeatures.js";
import { RepositoryModel } from "../models/repoModel.js";
// import { sendImageToSift } from "../utility/sendToSift.js"

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
         const imagesName = `product-${uuidV4()}-${Date.now()}.png`
         await sharp(image.buffer)
         // . resize(1200, 1333)
         .toFormat("png")
         .png({quality: 90})
         .toFile(`uploads/products/${imagesName}`)
         req.body.images.push(imagesName)
      }))
   }
   next()
})

export const uploadPodactImage = uploadMulityImage([{name: "imageCovered", maxCount: 1 }, {name: "images", maxCount: 6},{name: "boxImages", maxCount:5 }])


export const createProduct = async (req,res)=>{

   const product = await ProductModel.create(req.body)
   const productRepository = new RepositoryModel()
   productRepository.productId = product._id
   productRepository.salesQuantity = 0;
   productRepository.salesPrice = 0;
   productRepository.lastAddQuantity = 0;
   productRepository.totalQuantity = 0;
   productRepository.currantQuantity = 0;
   productRepository.productInBox = 0;
   productRepository.numberOfBox = 0;
   productRepository.invoice = []

   // const response = await sendImageToSift(req.files.boxImages, product._id)
   // if(!response.data){
   //    res.status(500).json({message:response.data})
   // }
   res.status(201).json({product})

}

export const getProdects = getAll(ProductModel, "Product")

export const getProduct = async (req,res)=>{
   console.log(req.params.id)
   let product = await ProductModel.findById(req.params.id)
      .populate("repoInfo")
   product = await product.populate({path: "repoInfo.supplier"})
   product = await product.populate({path: "repoInfo.invoice"})
   res.status(200).json({data: product})
}
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






