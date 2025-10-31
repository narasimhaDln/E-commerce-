import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/item/:productId', removeCartItem);
router.delete('/clear', clearCart);

export default router;
