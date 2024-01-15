
import { ReviewModel } from "../models/reviewModel.js" 
import { deleteItem, updateItem, createItem, getItem, getAll } from './handerFactory.js'

export const setProductIdToBody = (req, res, next)=>{
   if (req.params.productId) req.body.product = req.params.productId;
   next()
}

export const createFilterObjForReviews = (req, res, next)=>{
   let filterRev = {};
   if (req.params.productId) filterRev = { product: req.params.productId } ;
   req.filterSub = filterRev;
   next();
}

export const createReview = createItem(ReviewModel)

export const getReviews = getAll(ReviewModel)

export const getReview = getItem(ReviewModel)

export const updateReview = updateItem(ReviewModel)

export const deleteReview = deleteItem(ReviewModel)

