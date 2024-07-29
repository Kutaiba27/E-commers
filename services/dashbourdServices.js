import { RepositoryModel } from "../models/repoModel.js"
import { uploadMulityImage } from '../middlewares/uploadImageMiddlewares.js'
import { UserModel } from "../models/userModel.js"
import { Types } from 'mongoose'
import axios from "axios"
import asyncHandler from "express-async-handler";



export const uploudImageForInventory = uploadMulityImage([{name: "imageToInventory", maxCount:1}])


export const numberOfProducts = asyncHandler(async (req,res)=>{
   const response = await axios.post('http://127.0.0.1:8000/upload-files/inventory-product',{imageToInventory:req.files[0]})
   res.status(200).json(response)
})

export const inventory = async(req,res)=>{
   const inventory = await RepositoryModel.aggregate([
      { $match: { productId:  new Types.ObjectId(req.body.id) } },
      { $lookup:{
         from: "products",
         localField: "productId",
         foreignField: "_id",
         pipeline:[
            {
               $lookup:{
                  from: "categories",
                  localField: "category",
                  foreignField: "_id",
                  as: "category"
               },
            }
         ],
         as: "productId"
      }
      },
      { $project: {
            "currantQuantity": 1,
            "totalQuantity": 1,
            "lastAddQuantity": 1,
            "price": 1,
            "salesQuantity":1,
         }
      }
   ]);
   res.json(inventory)
}

export const mostPurchesesUser = asyncHandler(async (req, res)=>{
   const users = await UserModel.aggregate([
      {
         $sort: {totalPurchases: -1}
      },
      {
         $project: {
            _id: 0,
            name: 1,
            email: 1,
            totalPurchases: 1,
         }
      },
      {
         $limit: 3
      }
   ])
   res.status(200).json({
      data: users
   })
})


export const topSellingProducts = asyncHandler(async(req,res)=>{
   const products = await RepositoryModel.aggregate([
      {
         $sort: {salesQuantity: -1}
      },
      {
         $lookup:{
            from: "products",
            localField: "productId",
            foreignField: "_id",
            pipeline:[
               {
                  $lookup:{
                     from: "category",
                     localField: "category",
                     foreignField: "_id",
                     as: "category"
                  },
               },
               {
                  $lookup:{
                     from: "brand",
                     localField: "brand",
                     foreignField: "_id",
                     as: "brand"
                  },
               },
            ],
            as: "productId"
         }
      },
      {
         $limit: 3
      }
   ])
   res.status(200).josn({ 
      data: products
   })
})

export const byImage = async(req,res)=>{
   const frontBase64 = req.files.front[0].buffer.toString('base64');
   const backBase64 = req.files.back[0].buffer.toString('base64');
   console.log(frontBase64)
   console.log(backBase64)
   const resposeFromServer = await axios.post("http://127.0.0.1:8000/upload",{front:frontBase64, back: backBase64});
   console.log(resposeFromServer.data.file);
   res.json({"message":"successfully"})
}