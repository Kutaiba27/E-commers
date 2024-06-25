
import { Router } from "express";

import { addSupplier, deleteSupplier, getAllSupplier, getSupplier, updateSupplier  } from '../services/supplierServices.js'


const router = Router();

router.route('/')
      .get(getAllSupplier)
      .post(addSupplier)
      
router.route('/:id')
      .get(getSupplier)
      .put(updateSupplier)
      .delete(deleteSupplier)

export {router as SupplierRouter}
