import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import HomePage from './pages/HomePage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import VerifyPage from './pages/VerifyPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { api } from './lib/api.js';
import toast from 'react-hot-toast';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AuthLayout() {
  const { loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Shop
          </h1>
          <p className="text-gray-600">
            Your one-stop destination for amazing products
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Forms Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isLogin ? <LoginPage /> : <RegisterPage />}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Shop. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function Layout() {
  const { user, logout, setUser, login } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: '',
    password: '',
  });
  const [adminLoginError, setAdminLoginError] = useState('');
  const searchTimeoutRef = useRef(null);

  async function toggleRole() {
    if (user?.role === 'admin') {
      // Switch from admin to user session: sign out to avoid admin perms lingering
      logout();
      toast.success('Switched to user mode');
      navigate('/login');
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
        // Switch session to admin account
        login(res.data.token, res.data.user);
        setShowAdminLogin(false);
        setAdminCredentials({ email: '', password: '' });
        toast.success('Switched to admin mode');
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
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur sticky top-0 z-40 border-b border-gray-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition"
          >
            Shop
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-blue-200 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center text-sm">
            <Link
              to="/"
              className="text-white hover:text-blue-200 transition font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-blue-200 transition font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-blue-200 transition font-medium"
            >
              Contact
            </Link>
            <input
              type="text"
              placeholder="Search products..."
              className="bg-white text-gray-900 px-3 py-1 rounded-md text-sm border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => {
                const q = e.target.value;
                if (searchTimeoutRef.current) {
                  clearTimeout(searchTimeoutRef.current);
                }
                searchTimeoutRef.current = setTimeout(() => {
                  if (q) {
                    navigate(`/?q=${encodeURIComponent(q)}`);
                  } else {
                    navigate('/');
                  }
                }, 500);
              }}
            />
            <Link
              to="/cart"
              className="text-white hover:text-blue-200 transition font-medium"
            >
              Cart
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-white hidden sm:block">
                    {user.name}{' '}
                    {user.role === 'admin' && (
                      <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-1 py-0.5 rounded ml-1">
                        Admin
                      </span>
                    )}
                  </span>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>
                    {user?.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Product
                      </Link>
                    ) : null}
                    <button
                      onClick={() => {
                        toggleRole();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      Switch to {user?.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        logout();
                        toast.success('Logged out');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-blue-200 transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
              <div className="px-4 py-4 space-y-4">
                <Link
                  to="/"
                  className="block text-gray-900 hover:text-blue-600 transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block text-gray-900 hover:text-blue-600 transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-900 hover:text-blue-600 transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-md text-sm border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => {
                    const q = e.target.value;
                    if (searchTimeoutRef.current) {
                      clearTimeout(searchTimeoutRef.current);
                    }
                    searchTimeoutRef.current = setTimeout(() => {
                      if (q) {
                        navigate(`/?q=${encodeURIComponent(q)}`);
                      } else {
                        navigate('/');
                      }
                      setMobileMenuOpen(false);
                    }, 500);
                  }}
                />
                <Link
                  to="/cart"
                  className="block text-gray-900 hover:text-blue-600 transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart
                </Link>
                {user ? (
                  <div className="border-t pt-4 space-y-2">
                    <Link
                      to="/profile"
                      className="block text-gray-900 hover:text-blue-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block text-gray-900 hover:text-blue-600 transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Add Product
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-900 hover:text-blue-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="border-t pt-4 space-y-2">
                    <Link
                      to="/login"
                      className="block text-gray-900 hover:text-blue-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block text-gray-900 hover:text-blue-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

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

      <main className="flex-1 w-full px-4 py-6 bg-white min-h-screen overflow-y-auto scrollbar-hide">
        <style>{`
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:token" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute admin>
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Shop
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/register" element={<AuthLayout />} />
        <Route path="/verify/:token" element={<VerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </AuthProvider>
  );
}
