import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function CartPage() {
  const [cart, setCart] = useState(null);

  async function load() {
    const res = await api.get('/cart');
    setCart(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function update(productId, quantity) {
    await api.put('/cart/update', { productId, quantity });
    load();
  }

  async function removeItem(productId) {
    await api.del(`/cart/item/${productId}`);
    load();
  }

  if (!cart) return <div>Loading...</div>;
  const total = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {cart.items.map((i) => (
            <div
              key={i.product._id}
              className="flex items-center gap-4 bg-white p-3 rounded shadow"
            >
              <img
                src={i.product.image || 'https://via.placeholder.com/100'}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-semibold">{i.product.name}</div>
                <div className="text-blue-700">${i.product.price}</div>
              </div>
              <input
                type="number"
                min="0"
                value={i.quantity}
                onChange={(e) => update(i.product._id, Number(e.target.value))}
                className="border p-1 rounded w-20"
              />
              <button
                onClick={() => removeItem(i.product._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right text-xl font-bold">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
