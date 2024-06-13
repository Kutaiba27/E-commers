import multer from "multer";

import { ApiError } from "../utility/apiError.js";

const multerOptions = ()=>{
   const multerFilter = (req, file, cb) => {
      if( file.mimetype.split('/')[0] == 'image'){
         cb(null, true)
      }else {
         cb(new ApiError("the file must be image", 400),false);
      }
   }
   
   const multerStorage = multer.memoryStorage();
   
   const upload = multer({ storage: multerStorage, fileFilter: multerFilter  })

   return upload
}

export function uploadSingleImage(fieldName) { return multerOptions().single(fieldName); }

export function uploadMulityImage(multerFields) { return multerOptions().fields(multerFields); }