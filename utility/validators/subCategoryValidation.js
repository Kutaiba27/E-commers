import { check, body } from "express-validator";
import { validatorMiddleware } from '../../middlewares/validatorMiddlewares.js'
import slugify from 'slugify'

export const createSubCategoryValidator = [
   check('name')
      .notEmpty()
      .withMessage("The Name Is Required")
      .isLength({min: 3})
      .withMessage("The Length So Short")
      .isLength({max: 32})
      .withMessage("The Length So Long")
      .custom((val ,{ req })=> req.body.slug = slugify(val)),
      check('category')
      .notEmpty()
      .withMessage('category Must Be R')
      .isMongoId()
      .withMessage("Invalid Id"),
      validatorMiddleware
]

export const getSubCategoryValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];

export const updateSubCategoryValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   body("name").custom((val ,{ req })=> req.body.slug = slugify(val)),
   validatorMiddleware
];

export const deleteSubCategoryValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];