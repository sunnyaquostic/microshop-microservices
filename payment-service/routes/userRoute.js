import { Router } from 'express';
import { 
    createOrder, 
    login, 
    logout, 
    register, 
    requestPasswordReset, 
    resetPassword, 
    updatePassword, 
    updateUserInfo, 
    users 
} from "../controllers/userController.js";
import { verifyUserAuth } from '../middleware/userAuth.js';

const router = Router()

router.route('/register').post(register)
router.route('/users').get(users)
router.route('/login').post(login)
router.route('/reset/:id').get(resetPassword)
router.route('/password/forgot').post(requestPasswordReset)
router.route('/logout').post(verifyUserAuth,logout)
router.route('/updateinfo').post(verifyUserAuth,updateUserInfo)
router.route('/updatepassword').post(verifyUserAuth,updatePassword)

export default router