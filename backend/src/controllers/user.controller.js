import { User } from '../models/User.js';
import { Cart } from '../models/Cart.js';

export async function getMe(req, res) {
  res.json(req.user);
}

export async function updateMe(req, res) {
  const { name, email, avatarUrl, password, role } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (name) user.name = name;
  if (email) user.email = email;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (password) user.password = password;
  // Allow role updates for demo purposes (in production, restrict this)
  if (role && ['user', 'admin'].includes(role)) user.role = role;
  await user.save();
  const sanitized = await User.findById(user._id).select('-password');
  res.json(sanitized);
}

export async function getMyCartHistory(req, res) {
  // Simplified: return current cart as "history" placeholder
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
  );
  res.json({ carts: cart ? [cart] : [] });
}
