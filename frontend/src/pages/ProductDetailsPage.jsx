import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  async function addToCart() {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    await api.post('/cart/add', { productId: id, quantity });
    toast.success('Added to cart');
  }

  if (!product) return <div>Loading...</div>;
  return (
    <div className="relative">
      {/* Close Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Close"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-600 overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/800x600'}
            alt={product.name}
            className="w-full object-cover"
          />
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-600 p-6">
          <h1 className="text-3xl font-extrabold text-white">{product.name}</h1>
          <div className="mt-2 text-sm text-gray-300">{product.category}</div>
          <p className="mt-4 text-gray-300 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-6">
            <div className="text-3xl font-bold text-indigo-400">
              ${product.price}
            </div>
            {product.countInStock > 0 ? (
              <div className="mt-1 text-sm text-green-600">
                In Stock ({product.countInStock})
              </div>
            ) : (
              <div className="mt-1 text-sm text-red-600">Out of Stock</div>
            )}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-500 bg-gray-700 text-white p-3 rounded-lg w-24 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
            <button
              onClick={addToCart}
              disabled={product.countInStock <= 0}
              className={`px-6 py-3 rounded-lg font-semibold shadow transition text-white ${
                product.countInStock <= 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              {product.countInStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
