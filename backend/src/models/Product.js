import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    category: { type: String, default: 'general' },
    countInStock: { type: Number, default: 0 },
    brand: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    features: [{ type: String }],
    specifications: { type: Map, of: String },
  },
  { timestamps: true },
);

export const Product = mongoose.model('Product', productSchema);
