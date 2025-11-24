import express from 'express';
import {
  signup,
  login,
  adminLogin,
  getEmployees,
} from '../Controllers/autController.js';
import { validateRequest } from '../Middlewares/validateRequest.js';
import { signupSchema, loginSchema } from '../validations/authValidations.js';
import { authenticateToken } from '../Middlewares/autmiddleware.js';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.post('/admin', validateRequest(loginSchema), adminLogin);
router.get('/employees', authenticateToken, getEmployees);

export default router;
