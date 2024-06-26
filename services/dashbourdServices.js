import { RepositoryModel } from "../models/repoModel.js"
import { uploadMulityImage } from '../middlewares/uploadImageMiddlewares.js'
import { Types } from 'mongoose'
import axios from "axios"
import asyncHandler from "express-async-handler";



export const uploudImageForInventory = uploadMulityImage([{name: "imageToInventory", maxCount:1}])

export const hightSeles = asyncHandler(async (req,res)=>{
   
   const hightSelse = await RepositoryModel.aggregate([
      { $group: {
            _id:"$_id"
         },
      },
      {
         $sort: {
            salesQuantity: -1
         }
      },
      {
         $limit: 1
      }
   ])
   res.status(200).json({"hightSelse":hightSelse[0]})
})

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

export const byImage = async(req,res)=>{
   const frontBase64 = req.files.front[0].buffer.toString('base64');
   const backBase64 = req.files.back[0].buffer.toString('base64');
   console.log(frontBase64)
   console.log(backBase64)
   const resposeFromServer = await axios.post("http://127.0.0.1:8000/upload",{front:frontBase64, back: backBase64});
   console.log(resposeFromServer.data.file);
   res.json({"message":"successfully"})
}