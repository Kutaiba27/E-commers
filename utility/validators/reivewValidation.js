
import { check } from "express-validator";
import { validatorMiddleware } from '../../middlewares/validatorMiddlewares.js'
import { ReviewModel } from "../../models/reviewModel.js";

export const createReviewValidator = [
   check('description')
      .optional(),
   check('rate')
      .notEmpty()
      .withMessage("rate must be required")
      .isFloat()
      .withMessage("rate must be numeric")
      .isLength({ min: 1, max: 5 })
      .withMessage("rate must be between 1 and 5")
      .custom((val, {req})=> req.body.user = req.user._id)
      .custom((val, { req }) => ReviewModel.findOne({ user: req.user._id, product: req.body.product })
         .then((review) => {
            if (review) {
               throw new Error(" you cannot review a product more than once")
            }
            return true;
         })),
   validatorMiddleware
];

export const getReviewValidator = [
   check("id").isMongoId().withMessage("This Invaild Id"),
   validatorMiddleware
];

export const updateReviewValidator = [
   check('description')
      .optional(),
   check('rate')
      .notEmpty()
      .withMessage("rate must be required")
      .isFloat()
      .withMessage("rate must be numeric")
      .isLength({ min: 1, max: 5 })
      .withMessage("rate must be between 1 and 5")
      .custom((val, {req})=> req.body.user = req.user._id)
      .custom(async (val, { req }) => {
         if (req.user.role == "user") {
            const review = await ReviewModel.findOne({ user: req.body.user });
            if (!review || review.user._id.toString() != req.body.user.toString()) {
               throw new Error("only user can modify this review");
            }
            return true;
         } else if (req.user.role == "admin" || req.user.role == "manager") {
            return true;
         } else {
            throw new Error("there is a problem in permissions");
         }
      }),
   validatorMiddleware
];

export const deleteReviewValidator = [
      check()
      .custom((val, {req})=> req.body.user = req.user._id)
      .custom(async (val, { req }) => {
         if (req.user.role == "user") {
            const review = await ReviewModel.findOne({ user: req.body.user });
            if (!review || review.user._id.toString() != req.body.user.toString()) {
               throw new Error("only user can delete this review");
            }
            return true;
         } else if (req.user.role == "admin" || req.user.role == "manager") {
            return true;
         } else {
            throw new Error("there is a problem in permissions");
         }
      }),
   validatorMiddleware
];
