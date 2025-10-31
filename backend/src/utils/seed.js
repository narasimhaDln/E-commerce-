import { Product } from '../models/Product.js';

export async function seedDefaultProducts() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  const defaults = [
    {
      name: 'Classic Sneakers',
      description: 'Comfortable everyday sneakers with breathable mesh.',
      price: 59.99,
      image:
        'https://media.istockphoto.com/id/1412240771/photo/headphones-on-white-background.jpg?s=612x612&w=0&k=20&c=DwpnlOcMzclX8zJDKOMSqcXdc1E7gyGYgfX5Xr753aQ=',
      category: 'shoes',
      countInStock: 50,
    },
    {
      name: 'Denim Jacket',
      description: 'Timeless denim jacket for all seasons.',
      price: 79.0,
      image:
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format',
      category: 'apparel',
      countInStock: 30,
    },
    {
      name: 'Wireless Headphones',
      description: 'Over-ear, noise-cancelling wireless headphones.',
      price: 129.99,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhSxxf2HMnYkf3up490eA8EJsyudL4GPLqVA&s',
      category: 'electronics',
      countInStock: 25,
    },
  ];
  await Product.insertMany(defaults);
  console.log('Seeded default products');
}
