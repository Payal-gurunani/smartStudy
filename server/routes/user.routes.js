import {Router} from 'express';
const router = Router();

// Controllers (implement these functions in your controllers/user.controller.js)
import {Register as register, loginUser, logoutUser, getProfile} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

// Register route
router.route('/register').post(register);

// Login route
router.route('/login').post(loginUser);

// Logout route
router.route('/logout').get(logoutUser);
router.route('/profile').get(isAuthenticated,getProfile)
export default router;