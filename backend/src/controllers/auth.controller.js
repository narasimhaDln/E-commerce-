import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import {
  tplWelcome,
  tplVerifyEmail,
  tplLoginNotification,
  tplResetPassword,
  tplPasswordResetSuccess,
} from '../emails/templates.js';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: 'Email already in use' });
  // Create user and auto-verify for simplified flow; send welcome email
  const user = await User.create({ name, email, password, isVerified: true });
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Our Platform',
    html: tplWelcome({ name: user.name }),
  });
  const token = signToken(user);
  res.status(201).json({
    message: 'Registered successfully. Welcome email sent.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).json({ message: 'Invalid token' });
  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  res.json({ message: 'Email verified successfully' });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  if (!user.isVerified)
    return res.status(403).json({ message: 'Please verify your email' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  // Send login notification email
  await sendEmail({
    to: user.email,
    subject: 'Login Notification',
    html: tplLoginNotification({ name: user.name }),
  });
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    user.resetPasswordToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30); // 30m
    await user.save();
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${user.resetPasswordToken}`;
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: tplResetPassword({ name: user.name, resetUrl }),
    });
  }
  res.json({ message: 'If that email exists, a reset link was sent.' });
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user)
    return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
}
