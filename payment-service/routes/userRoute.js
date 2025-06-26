import { Router } from 'express';
import { 
    createOrder, 
    login, 
    register, 
    users 
} from "../controllers/userController.js";

const router = Router()

router.route('/register').post(register)
router.route('/users').get(users)
router.route('/login').post(login)

export default router