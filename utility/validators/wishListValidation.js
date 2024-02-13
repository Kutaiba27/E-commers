import { body, param } from "express-validator"
import { validatorMiddleware } from  "../../middlewares/validatorMiddlewares.js"

export const addWishListValidator = [
   body('product')
      .notEmpty()
      .withMessage("Id must be required")
      .isMongoId()
      .withMessage("that is must be MondoDB id"),
   validatorMiddleware
]

export const removeWishListValidator = [
   param("idProduct")
      .notEmpty()
      .withMessage("id must be required")
      .isMongoId()
      .withMessage("must be mongodbId"),
   validatorMiddleware
]