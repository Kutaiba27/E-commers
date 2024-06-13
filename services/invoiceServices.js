import { InvoicesModel } from "../models/invoicesModel.js";
import { createItem, deleteItem, getAll, getItem, updateItem } from "./handerFactory.js";


export const addInvoices = createItem(InvoicesModel);

export const getInvoices = getItem(InvoicesModel,'productId supplierId');

export const getAllInvoices =  getAll(InvoicesModel);

export const deleteInvoices = deleteItem(InvoicesModel);

export const updateInvoices = updateItem(InvoicesModel);