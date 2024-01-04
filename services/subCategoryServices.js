
import { SubCategoryModel } from "../models/subCategoryModel.js" 
import { deleteItem, updateItem, createItem, getItem, getAll } from './handerFactory.js'

export const setCategoryIdToBody = (req, res, next)=>{
   if (!req.params.category)  req.body.category = req.body.categoryId;
   next()
}

export const createFilterObj = (req, res, next)=>{
   let filterSub = {};
   if ( req.params.categoryId) filterSub = { category: req.params.categoryId } ;
   req.filterSub = filterSub;
   next();
}

export const createSubCategory = createItem(SubCategoryModel)

export const getSubCategories = getAll(SubCategoryModel)

export const getSubCategory = getItem(SubCategoryModel)

export const updateSubCategory = updateItem(SubCategoryModel)

export const deleteSubCategory = deleteItem(SubCategoryModel)

