import { InvoicesModel } from "../models/invoicesModel.js";
import { RepositoryModel } from "../models/repoModel.js";
import { ProductModel} from "../models/productModel.js"
import { deleteItem, getAll, getItem } from "./handerFactory.js";
import asyncHandler from 'express-async-handler'


export const addRepository = asyncHandler(async (req, res)=>{
   const newInvoice = await InvoicesModel.create({
      price: req.body.price ,
      productId: req.body.productId,
      quantity: req.body.addQuantity,
      numberOfBox: req.body.numberOfBox,
      productInBox: req.body.productInBox,
      totalPrice: req.body.price * (req.body.numberOfBox * req.body.productInBox),
      supplierId: req.body.supplier
   })
   req.body.invoice = newInvoice._id
   const prodRepo = await RepositoryModel.create({
      price: req.body.price,
      productInBox: req.body.productInBox,
      numberOfBox: req.body.numberOfBox,
      currantQuantity: req.body.productInBox * req.body.numberOfBox,
      totalQuantity: req.body.productInBox * req.body.numberOfBox,
      invoice: newInvoice._id,
      lastAddQuantity: req.body.addQuantity,
      productId: req.body.productId,
      supplier: req.body.supplier
   })
   const product = await ProductModel.findById(req.body.productId)
   product.repoInfo = prodRepo._id
   await product.save()
   res.json({data :{
      prodRepo,
      newInvoice
   }})
});

export const getRepository = getItem(RepositoryModel);

export const getAllRepository =  getAll(RepositoryModel,"repo");

export const deleteRepository = deleteItem(RepositoryModel);

export const updateRepository = async( req,res)=>{
   console.log(req.body.productId)
   const productRepo = await RepositoryModel.findOne({productId: req.body.productId})
   const newProdRepo = await RepositoryModel.updateOne(
      {productId:req.body.productId},
      {
         currantQuantity: productRepo.currantQuantity + (req.body.numberOfBox * req.body.productInBox),
         totalQuantity: productRepo.totalQuantity + (req.body.numberOfBox * req.body.productInBox),
         lastAddQuantity: (req.body.numberOfBox * req.body.productInBox),
         price: req.body.price,
         supplier: req.body.supplier
      },{
         new: true
      }
   )
   const newInvoice = await InvoicesModel.create({
      price: req.body.price,
      productId: productRepo.productId,
      numberOfBox: req.body.numberOfBox,
      productInBox: req.body.productInBox,
      quantity: (req.body.numberOfBox * req.body.productInBox),
      supplierId: req.body.supplier,
      totalPrice: (req.body.numberOfBox * req.body.productInBox) * req.body.price
   })
   productRepo.invoice = newInvoice
   
   res.json({
      newInvoice,
      newProdRepo
   })
};

export const aggregation = async (req, res) => {
   const data = await RepositoryModel.aggregate([
      {
         $lookup:{
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
         },
      },
      {
         $project: {
            _id: 0
         }
      }
   ])
   console.log(data)
   res.json(data)
}

export const getItemRepo = async(req,res)=>{
   const items = await RepositoryModel.findOne({productId: req.params.id}).populate('productId supplier')
   res.json({items})
}