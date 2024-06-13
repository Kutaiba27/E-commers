
import { Router } from "express";

import {
   createReview,
   deleteReview,
   getReview,
   getReviews,
   updateReview,
   createFilterObjForReviews,
   setProductIdToBody
} from "../services/reviewServices.js"

import { createReviewValidator, updateReviewValidator, deleteReviewValidator } from "../utility/validators/reivewValidation.js";

import { protect, allowTo } from "../services/authServices.js";

const router = Router({ mergeParams: true});

router.route('/')
   .get(createFilterObjForReviews,getReviews)
   .post(
      protect,
      setProductIdToBody,
      createReviewValidator,
      createReview
   );

router.route('/:id')
   .get(getReview)
   .put(
      protect,
		allowTo('user'),
      updateReviewValidator, 
      updateReview
      )
   .delete(
      protect,
		allowTo('manger','user','admin'),
      deleteReviewValidator,
      deleteReview
      );


export { router as ReviewRouter }