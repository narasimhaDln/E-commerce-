import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    brand: '',
    countInStock: '',
    rating: '',
    numReviews: '',
    features: '',
    specifications: '',
  });

  async function load() {
    const res = await api.get('/products');
    setProducts(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createProduct(e) {
    e.preventDefault();
    const productData = {
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock) || 0,
      rating: Number(form.rating) || 0,
      numReviews: Number(form.numReviews) || 0,
      features: form.features
        ? form.features.split(',').map((f) => f.trim())
        : [],
      specifications: form.specifications
        ? JSON.parse(form.specifications)
        : {},
    };
    try {
      if (form._id) {
        await api.put(`/admin/products/${form._id}`, productData);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', productData);
        toast.success('Product created');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }

    setForm({
      _id: undefined,
      name: '',
      price: '',
      description: '',
      image: '',
      category: '',
      brand: '',
      countInStock: '',
      rating: '',
      numReviews: '',
      features: '',
      specifications: '',
    });
    load();
  }

  async function updateProduct(id, updates) {
    try {
      await api.put(`/admin/products/${id}`, updates);
      toast.success('Product updated');
      load();
    } catch (err) {
      toast.error('Update failed');
    }
  }

  async function deleteProduct(id) {
    try {
      await api.del(`/admin/products/${id}`);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error('Delete failed');
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {form._id ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={createProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Electronics, Clothing"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Apple, Samsung"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Count
            </label>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0"
              value={form.countInStock}
              onChange={(e) =>
                setForm({ ...form, countInStock: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (0-5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="4.5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Reviews
            </label>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="0"
              value={form.numReviews}
              onChange={(e) => setForm({ ...form, numReviews: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (comma-separated)
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Wireless, Bluetooth, Fast Charging"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specifications (JSON format)
            </label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder='{"color": "Black", "weight": "150g"}'
              value={form.specifications}
              onChange={(e) =>
                setForm({ ...form, specifications: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="4"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe the product..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
              {form._id ? 'Update Product' : 'Add Product'}
            </button>
            {form._id && (
              <button
                type="button"
                onClick={() =>
                  setForm({
                    _id: undefined,
                    name: '',
                    price: '',
                    description: '',
                    image: '',
                    category: '',
                    brand: '',
                    countInStock: '',
                    rating: '',
                    numReviews: '',
                    features: '',
                    specifications: '',
                  })
                }
                className="px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Product Management
        </h2>
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products yet
              </h3>
              <p className="text-gray-600">
                Start by adding your first product using the form.
              </p>
            </div>
          ) : (
            products.map((p) => (
              <div
                key={p._id}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={p.image || 'https://via.placeholder.com/100'}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    alt={p.name}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{p.category}</p>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          ${p.price}
                        </span>
                        <div className="text-sm text-gray-600">
                          {p.brand && <span>Brand: {p.brand}</span>}
                          {p.countInStock !== undefined && (
                            <span
                              className={`ml-2 ${
                                p.countInStock > 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              Stock: {p.countInStock}
                            </span>
                          )}
                        </div>
                        {p.rating > 0 && (
                          <div className="text-sm text-yellow-600">
                            ★ {p.rating} ({p.numReviews} reviews)
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateProduct(p._id, { price: p.price + 1 })
                          }
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          +$1
                        </button>
                        <button
                          onClick={() => {
                            // Populate form with existing product data for editing
                            setForm({
                              _id: p._id,
                              name: p.name,
                              price: p.price.toString(),
                              description: p.description,
                              image: p.image,
                              category: p.category,
                              brand: p.brand || '',
                              countInStock: p.countInStock?.toString() || '',
                              rating: p.rating?.toString() || '',
                              numReviews: p.numReviews?.toString() || '',
                              features: p.features?.join(', ') || '',
                              specifications: p.specifications
                                ? JSON.stringify(p.specifications, null, 2)
                                : '',
                            });
                            // Scroll to form
                            document
                              .querySelector('.md\\:col-span-1')
                              ?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p._id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
