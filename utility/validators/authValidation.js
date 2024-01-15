import { check } from "express-validator";
import slugify from 'slugify'

import { UserModel } from "../../models/userModel.js";
import { validatorMiddleware } from '../../middlewares/validatorMiddlewares.js'

export const signUserValidator = [
   check('name')
      .notEmpty()
      .withMessage("The Name Is Required")
      .isLength({ min: 2 })
      .withMessage("The Length So Short")
      .isLength({ max: 32 })
      .withMessage("The Length So Long")
      .custom((val, { req }) => req.body.slug = slugify(val)),
   check('email')
      .notEmpty()
      .withMessage("The Email Is Required")
      .isEmail()
      .withMessage("The Email Is Not Invalid Email")
      .custom((val) => UserModel.findOne({ email: val })
         .then((user) => {
            if (user) {
               return Promise.reject(new Error("The Email Is Used"));
            }
         })),
   check('password')
      .notEmpty()
      .withMessage("The Passwordd Must Be Required")
      .isLength({min: 8})
      .withMessage("The Password Must Be Above The 8 Character Limit"),
   check('passwordConfirmation')
      .notEmpty()
      .withMessage("The Password Confirmation Required ")
      .custom((val, { req })=>{
         if(val != req.body.password){
            throw new Error("The Password and PasswordConfirmation Not Equal ")
         }
         return true;
      }),
   check('phone').optional().isMobilePhone(["ar-SY"]),
   check('profileImage').optional(),
   check('rule').optional(),
   validatorMiddleware
]

export const loginUserValidator = [
   check('email')
      .notEmpty()
      .withMessage("The Email Is Required")
      .isEmail()
      .withMessage("The Email Is Not Invalid Email")
      .custom((val) => UserModel.findOne({ email: val })
         .then((user) => {
            if (!user) {
               return Promise.reject(new Error("you are not register you should to sigIn"));
            }
         })),
   check('password')
      .notEmpty()
      .withMessage("The Passwordd Must Be Required")
      .isLength({min: 8})
      .withMessage("The Password Must Be Above The 8 Character Limit"),
      validatorMiddleware
]