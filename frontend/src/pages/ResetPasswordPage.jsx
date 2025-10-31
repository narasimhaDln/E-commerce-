import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setMessage('Password reset! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setMessage('Reset failed or token expired');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl border border-indigo-50">
        <h1 className="text-2xl font-extrabold mb-2 text-gray-900">
          Reset password
        </h1>
        {message && (
          <div className="mb-3 text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded">
            {message}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg font-semibold shadow">
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}
