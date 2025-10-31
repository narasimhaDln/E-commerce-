import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { errorHandler } from './utils/errorHandler.js';
import { notFound } from './utils/notFound.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import adminProductRoutes from './routes/admin.product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import userRoutes from './routes/user.routes.js';
// import { seedDefaultProducts } from './utils/seed.js';
import { bootstrapAdmin } from './utils/bootstrapAdmin.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.CORS_ORIGIN].filter(Boolean),
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ecommerce-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  // Create admin user from env if none exists
  try {
    await bootstrapAdmin();
  } catch (e) {
    console.warn('Admin bootstrap skipped:', e?.message);
  }
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
