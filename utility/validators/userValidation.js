import { check, body } from "express-validator";
import slugify from 'slugify'
import bycrpt from 'bcryptjs'

import { validatorMiddleware } from '../../middlewares/validatorMiddlewares.js'
import { UserModel } from "../../models/userModel.js"


export const createUserValidator = [
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
      .withMessage("The Password Must Be Required")
      .isLength({min: 8})
      .withMessage("The Password Must Be Above The 8 Character Limit"),
   check('passwordConfirmation')
      .notEmpty()
      .withMessage("The Password Confirmation Required ")
      .custom((val, { req })=>{
         if(val !== req.body.password){
            throw new Error("The Password and PasswordConfirmation Not Equal ")
         }
         return true;
      }),
   check('phone').optional().isMobilePhone(["ar-SY"]),
   check('profileImage').optional(),
   check('rule').optional(),
   validatorMiddleware
]

export const getUserValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];

export const updateUserValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   body("name").optional().custom((val, { req }) => req.body.slug = slugify(val)),
   body('profileImage').optional(),
   validatorMiddleware
];

export  const changUserPasswordValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   body("currentPassword")
      .notEmpty()
      .withMessage("The current password must be required")
      .custom(async (val, {req})=>
         await UserModel.findById(req.params.id)
            .then(async (user) => {
               const isCorrect = await bycrpt.compare(req.body.currentPassword, user.password);
               if(!isCorrect) {
                  throw new Error("The current password is not correct")
               }
               return true
            })
      ),
   body('newPassword')
      .notEmpty()
      .withMessage("The new password must be required"),
   body('newPasswordConfirmation')
      .notEmpty()
      .withMessage("The new password confirmation must be required ")
      .custom((val, {req})=>{
         if(val != req.body.newPassword){
            throw new Error("The new password and confirmation password do not match")
         }
         return true
      }),
      validatorMiddleware
]

export const deleteUserValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];