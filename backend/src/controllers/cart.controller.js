import { Cart } from '../models/Cart.js';

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate('items.product');
  }
  return cart;
}

export async function getCart(req, res) {
  const cart = await getOrCreateCart(req.user._id);
  res.json(cart);
}

export async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find((i) => String(i.product._id) === productId);
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.status(201).json(populated);
}

export async function updateCartItem(req, res) {
  const { productId, quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((i) => String(i.product._id) === productId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.quantity = Number(quantity);
  if (item.quantity <= 0) {
    cart.items = cart.items.filter((i) => String(i.product._id) !== productId);
  }
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json(populated);
}

export async function removeCartItem(req, res) {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((i) => String(i.product._id) !== productId);
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product');
  res.json(populated);
}

export async function clearCart(req, res) {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json(cart);
}
