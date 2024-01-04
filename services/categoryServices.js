import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { v4 as uuidV4 } from "uuid"

import { CategoryModel } from "../models/categoryModel.js";
import { deleteItem, updateItem, createItem, getItem, getAll } from './handerFactory.js'
import { uploadSingleImage } from "../middlewares/uploadImageMiddlewares.js"

// const storage = multer.diskStorage({
//    destination: function(req,file,cb){
//       cb(null, "uploads/category")
//    },
//    filename: function(req,file,cb){
//       const ext = file.mimetype.split("/")[1];
//       const filename = `category-${uuidV4()}-${Date.now()}.${ext}`
//       cb(null, filename)
//    }
// })

// const multerFilter = (req, file, cb) => {
//    if( file.mimetype.split('/')[0] == 'image'){
//       cb(null, true)
//    }else {
//       cb(new ApiError("the file must be image", 400));
//    }
// }

// const multerStorage = multer.memoryStorage();

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter  })

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









