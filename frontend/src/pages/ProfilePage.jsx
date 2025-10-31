import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, setUser, logout, login, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    avatarUrl: '',
    password: '',
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: '',
    password: '',
  });
  const [adminLoginError, setAdminLoginError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || '',
        password: '',
      });
    }
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.put('/users/me', form);
      setUser(res.data);
      toast.success('Profile updated');
      if (form.password) toast.success('Password updated');
    } catch (err) {
      toast.error('Update failed');
    }
  }

  async function toggleRole() {
    if (user?.role === 'admin') {
      // Switching from admin to user - direct update
      try {
        const res = await api.put('/users/me', { role: 'user' });
        setUser(res.data);
        await refreshUser(); // Refresh user data to ensure consistency
        toast.success('Switched to user mode');
      } catch (err) {
        alert('Failed to update role');
      }
    } else {
      // Switching from user to admin - show admin login modal
      setShowAdminLogin(true);
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    setAdminLoginError('');

    try {
      // Verify admin credentials by attempting login
      const res = await api.post('/auth/login', adminCredentials);

      // Check if the logged-in user has admin role
      if (res.data.user.role === 'admin') {
        // Switch session to real admin account
        login(res.data.token, res.data.user);
        setShowAdminLogin(false);
        setAdminCredentials({ email: '', password: '' });
        toast.success('Switched to admin mode');
        // Redirect to admin page after successful admin login
        navigate('/admin');
      } else {
        setAdminLoginError('Invalid admin credentials');
        toast.error('Invalid admin credentials');
      }
    } catch (err) {
      setAdminLoginError('Invalid admin credentials');
      toast.error('Invalid admin credentials');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Your Profile
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">
              Admin Authentication Required
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Please enter admin credentials to switch to admin mode.
            </p>

            {adminLoginError && (
              <div className="mb-4 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
                {adminLoginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter admin email"
                  value={adminCredentials.email}
                  onChange={(e) =>
                    setAdminCredentials({
                      ...adminCredentials,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter admin password"
                  value={adminCredentials.password}
                  onChange={(e) =>
                    setAdminCredentials({
                      ...adminCredentials,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminCredentials({ email: '', password: '' });
                    setAdminLoginError('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Verify Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 text-center">
          <img
            src={
              form.avatarUrl ||
              'https://ui-avatars.com/api/?name=' +
                encodeURIComponent(form.name || 'User')
            }
            alt="avatar"
            className="mx-auto w-20 md:w-28 h-20 md:h-28 rounded-full object-cover border border-gray-200 shadow"
          />
          <div className="mt-3 font-semibold text-gray-900 text-sm md:text-base">
            {form.name || 'Your Name'}
          </div>
          <div className="text-xs md:text-sm text-gray-600 break-all">
            {form.email}
          </div>
        </div>
        <form
          onSubmit={onSubmit}
          className="md:col-span-2 space-y-3 md:space-y-4 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6"
        >
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              className="w-full border border-gray-300 p-2 md:p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-sm md:text-base"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-300 p-2 md:p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-sm md:text-base"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              className="w-full border border-gray-300 p-2 md:p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-sm md:text-base"
              placeholder="https://..."
              value={form.avatarUrl}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
              New Password (optional)
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 md:p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-sm md:text-base"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 md:px-5 py-2 md:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow transition text-sm md:text-base">
              Save changes
            </button>
            <button
              type="button"
              onClick={() =>
                setForm({
                  name: user.name,
                  email: user.email,
                  avatarUrl: user.avatarUrl || '',
                  password: '',
                })
              }
              className="px-4 md:px-5 py-2 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium border border-gray-200 transition text-sm md:text-base"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
