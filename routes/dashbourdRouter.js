import { Router } from "express";
import { RepositoryRouter } from "./repoRouter.js";
import { InvoicesRouter } from "./invoiceRoutes.js";
import { OrderRouter } from "./orderRoutes.js";
import { uploudImageToServer, byImage } from "../services/dashbourdServices.js";


const router = Router();


router.use('/repo',RepositoryRouter)
router.use('/invoices',InvoicesRouter)
router.use('/order',OrderRouter)
router.use('/byimage',uploudImageToServer,byImage)

export { router as dashbourdRouter } 