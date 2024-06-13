import { RepositoryModel } from "../models/repoModel.js"
import { Types } from 'mongoose'




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
