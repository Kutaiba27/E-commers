
import asyncHandler from 'express-async-handler'

import { ApiError } from '../utility/apiError.js'
import { ApiFeatures } from '../utility/apiFeatures.js';

const deleteItem = (Model)=> asyncHandler( async (req, res, next)=>{
   const { id } = req.params;
   const result = await Model.findOneAndDelete({_id:id});
   if(!result){
      return next(new ApiError(`There Are No Item For This Id: ${id}`,400));
   }
   // await result.remove();
   res.status(200).json({
      message: `Delete Item Successfully`,
      result: true
   });
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
   document.save();
   res.status(200).json({ data: document });
})

const createItem = (Model)=> asyncHandler(async (req, res) => {
   console.log("createItem")
   const newDoc = await Model.create(req.body);
   res.status(201).json({ date: newDoc });
});

const getItem = (Model, populateOpt, selectOpt)=> asyncHandler(async (req, res, next) => {
   const { id } = req.params;
   let query =  Model.findById(id);
   if(populateOpt){
      query = query.populate(populateOpt)
   }
   if(selectOpt){
      query = query.select(selectOpt);
   }
   const document = await query;
   if (!document) {
      return next(new ApiError(`There is no item with id ${id}`, 404));
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
      .search(modelName)
      .filter()
      .limitFeilds()
      .sort()
      const { mongooseQuery, pagenation } = apiFeatures
      if(modelName ==  "repo"){
         mongooseQuery.populate('invoice')
      }
      if(modelName == "Product"){
         mongooseQuery.populate("repoInfo")
      }
      const result = await mongooseQuery
   res.status(200).json({ result: result.length ,pagenation ,data: result });
});

export { deleteItem, updateItem, createItem, getItem, getAll }