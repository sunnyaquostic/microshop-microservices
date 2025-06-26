import { createOrder } from "../controllers/userController.js";
import { Router } from 'express';

const router = Router()

router.route('/payment-service', createOrder)

export default router