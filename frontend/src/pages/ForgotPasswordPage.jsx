import { useState } from 'react';
import { api } from '../lib/api.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    await api.post('/auth/forgot-password', { email });
    setMessage('If the email exists, a reset link was sent.');
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl border border-indigo-50">
        <h1 className="text-2xl font-extrabold mb-2 text-gray-900">
          Forgot password
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Enter your email to receive a reset link.
        </p>
        {message && (
          <div className="mb-3 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
            {message}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg font-semibold shadow">
            Send reset link
          </button>
        </form>
      </div>
    </div>
  );
}
