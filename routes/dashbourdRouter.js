import { Router } from "express";
import { RepositoryRouter } from "./repoRouter.js";
import { InvoicesRouter } from "./invoiceRoutes.js";
import { OrderRouter } from "./orderRoutes.js";


const router = Router();


router.use('/repo',RepositoryRouter)
router.use('/invoices',InvoicesRouter)
router.use('/order',OrderRouter)

export { router as dashbourdRouter } 