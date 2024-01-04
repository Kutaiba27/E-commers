import { check, body } from "express-validator";
import { validatorMiddleware } from '../../middlewares/validatorMiddlewares.js'
import slugify from 'slugify'


export const createBrandValidator = [
   check('name')
      .notEmpty()
      .withMessage("The Name Is Required")
      .isLength({min: 2})
      .withMessage("The Length So Short")
      .isLength({max: 32})
      .withMessage("The Length So Long")
      .custom((val ,{ req })=> req.body.slug = slugify(val)),
      
      validatorMiddleware
]

export const getBrandValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];

export const updateBrandValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   body("name").optional().custom((val ,{ req })=> req.body.slug = slugify(val)),
   validatorMiddleware
];

export const deleteBrandValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];