import { body, check } from "express-validator";
import { validatorMiddleware } from '../../middlewares/validatorMiddlewares.js'
import { CategoryModel } from "../../models/categoryModel.js";
import { SubCategoryModel } from "../../models/subCategoryModel.js";
import slugify from 'slugify'


export const createpoductValidator = [
   check('title')
   .isLength({min: 3})
   .withMessage("the length of the title short")
   .notEmpty()
   .withMessage("title is required")
   .custom((val, { req })=> req.body.slug = slugify(val)),
   check("description")
   .notEmpty()
   .withMessage("description is required")
   .isLength({max: 2000})
   .withMessage("the length of the description"),
   check("priceAfterDiscount")
   .optional()
   .isNumeric()
   .withMessage("the price must be a number")
   .toFloat()
   .custom((value, { req })=>{
      if (req.body.price >= value){
         return new Error("the priceAfterDiscount must be lower than the price ")
      }
      return true
   }),
   check("colors")
   .optional()
   .isArray()
   .withMessage("must be an array of String"),
   check("category")
   .notEmpty()
   .withMessage("category must be required")
   .isMongoId()
   .withMessage("Invalid Id ")
   .custom((categotyId)=>
      CategoryModel.findById({_id:categotyId}).then((category)=> {
         if(!category){
            return Promise.reject(new Error ("There is no category with the specified id")); 
         }
      })
   ),
   check("subCategory")
   .optional()
   .isArray()
   .withMessage("SubCategory must be an array")
   .isMongoId()
   .withMessage("Invalid MongoId")
   .custom((idArray, { req })=>
   SubCategoryModel.find({_id:{$exists:true, $in: idArray}}).then((result)=>{
         if( result.length < 1 || result.length !== idArray.length ){
            return Promise.reject(new Error( "Invalid subCategory id"))
         }
         console.log(result)
         let checker = result.every((item)=> item.category ==  req.body.category)
         console.log(checker)
         if(!checker){
            return Promise.reject(new Error ("this subCategory is not belong to the category"))
         }
      })
   ),
   check("imageCovered")
   .notEmpty()
   .withMessage("imageCoverd must be requred "),
   check("brand")
   .optional()
   .isMongoId()
   .withMessage("Invalid MongoId"),
   check("images")
   .optional()
   .isArray()
   .withMessage("Image Must Be An Array Of String"),
   check("ratingsAverage")
   .optional()
   .isNumeric()
   .withMessage("The RatingAvarage Must Be A Number")
   .isLength({min: 1, max: 5})
   .withMessage("The Value Must Be Between 1 and 5"),
   check("ratingsQuantity")
   .optional()
   .isNumeric()
   .withMessage("The Value Must Be Number"),
   validatorMiddleware
]

export const getProductValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];

export const updateProductValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   body("title").optional().custom((val ,{ req })=> req.body.slug = slugify(val)),
   validatorMiddleware
];

export const deleteProductValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];