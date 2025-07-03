import {Router} from 'express';
const router = Router();
import {Register as register, loginUser, logoutUser, getProfile, checkLogin} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
router.route('/register').post(register);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/check-login').get(isAuthenticated , checkLogin)
router.route('/profile').get(isAuthenticated,getProfile)
export default router;