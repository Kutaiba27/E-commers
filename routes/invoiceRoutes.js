import { Router } from "express";

import {
	addInvoices,
	deleteInvoices,
	getAllInvoices,
	getInvoices,
	updateInvoices,
} from "../services/invoiceServices.js";

const router = Router();

router.route("/").get(getAllInvoices).post(addInvoices);

router
	.route("/:id")
	.get(getInvoices)
	.put(updateInvoices)
	.delete(deleteInvoices);

export { router as InvoicesRouter };
