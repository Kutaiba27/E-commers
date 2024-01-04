import { body, check } from "express-validator";
import { validatorMiddleware } from '../../middlewares/validatorMiddlewares.js'
import slugify from 'slugify'

export const getCategoriesValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];

export const createCategoryValidator = [
   check('name')
      .notEmpty()
      .withMessage("The Name Is Required")
      .isLength({min: 3})
      .withMessage("The Length So Short")
      .isLength({max: 32})
      .withMessage("The Length So Long")
      .custom((val ,{ req })=> req.body.slug = slugify(val)),
      validatorMiddleware
]

export const updateCategoriesValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   body("name").custom((val, { req })=> req.body.slug = slugify(val)),
   validatorMiddleware
];

export const deleteCategoriesValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];

