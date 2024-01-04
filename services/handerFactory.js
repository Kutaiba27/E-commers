
import asyncHandler from 'express-async-handler'

import { ApiError } from '../utility/apiError.js'
import { ApiFeatures } from '../utility/apiFeatures.js';

const deleteItem = (Model)=> asyncHandler( async (req, res, next)=>{
   const { id } = req.params;
   const result = await Model.deleteOne({_id:id});
   if(!result){
      return next(new ApiError(`There Are No SubCategory For This Id: ${id}`,400));
   }
   res.status(200).json({message: `Delete SubCategory Successfully`});
})

const updateItem = (Model)=> asyncHandler(async (req, res, next) => {

   const document = await Model.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
   );
   if (!document) {
      return next(new ApiError("There Are Problem Or This item Is Not Exist", 400))
   }
   res.status(200).json({ data: document });
})

const createItem = (Model)=> asyncHandler(async (req, res) => {
   const newDoc = await Model.create(req.body);
   res.status(201).json({ date: newDoc });
});

const getItem = (Model)=> asyncHandler(async (req, res, next) => {
   const { id } = req.params;
   const document = await Model.findById(id);
   if (!document) {
      return next(new ApiError(`There is no category with id ${id}`, 404));
   }
   res.status(200).json({ data: document });
});

const getAll = (Model, modelName = '') => asyncHandler(async (req, res) => {

   let filter = {};
   if(req.filterSub){
      filter = req.filterSub
   }
   const countDocuments = await Model.countDocuments()
   const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .pagenate(countDocuments)
      .filter()
      .search(modelName)
      .limitFeilds()
      .sort()
      const { mongooseQuery, pagenation } = apiFeatures
      const brands = await mongooseQuery
   res.status(200).json({ result: brands.length ,pagenation ,data: brands });
});

export { deleteItem, updateItem, createItem, getItem, getAll }