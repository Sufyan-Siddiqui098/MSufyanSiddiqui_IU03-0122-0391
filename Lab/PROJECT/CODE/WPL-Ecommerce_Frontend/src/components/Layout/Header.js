import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { selectCartCount, fetchCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'SELLER') return '/seller';
    return '/profile';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-900 flex gap-1">
            <span className='border bg-gray-900 text-white font-extrabold text-sm rounded-md py-1 px-3'>C</span>
          <span> CartVerse </span>  
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-sm font-medium ${isActive('/') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Home</Link>
            <Link to="/products" className={`text-sm font-medium ${isActive('/products') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Products</Link>
            {isAuthenticated && <Link to="/orders" className={`text-sm font-medium ${isActive('/orders') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>My Orders</Link>}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"><span className="text-sm font-medium text-gray-600">{user?.firstName?.charAt(0)?.toUpperCase()}</span></div>
                  <span className="hidden lg:inline">{user?.firstName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                    <div className="px-4 py-2 border-b border-gray-100"><p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p><p className="text-xs text-gray-500">{user?.email}</p></div>
                    <Link to={getDashboardLink()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Dashboard</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                    {user?.role === 'SELLER' && <Link to="/seller/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Manage Orders</Link>}
                    {user?.role === 'SELLER' && <Link to="/seller/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>My Products</Link>}
                    <button onClick={() => { setUserMenuOpen(false); handleLogout(); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/signup" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">Sign Up</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">{cartCount}</span>}
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
              {mobileMenuOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              <Link to="/" className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive('/products') ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link to="/cart" className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive('/cart') ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
              {isAuthenticated && <Link to="/orders" className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive('/orders') ? 'bg-gray-100 text-gray-900' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>My Orders</Link>}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-3 py-2"><p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p><p className="text-xs text-gray-500">{user?.email}</p></div>
                  <Link to={getDashboardLink()} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/profile" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Link to="/login" className="block w-full py-2 text-center text-sm font-medium text-gray-600 border border-gray-200 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/signup" className="block w-full py-2 text-center text-sm font-medium bg-gray-900 text-white rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
