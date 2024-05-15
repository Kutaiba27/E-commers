import { SupplierModel } from "../models/supplierModel.js";
import { createItem, deleteItem, getAll, getItem, updateItem } from "./handerFactory.js";


export const addSupplier = createItem(SupplierModel);

export const getSupplier = getItem(SupplierModel);

export const getAllSupplier =  getAll(SupplierModel);

export const deleteSupplier = deleteItem(SupplierModel);

export const updateSupplier = updateItem(SupplierModel);