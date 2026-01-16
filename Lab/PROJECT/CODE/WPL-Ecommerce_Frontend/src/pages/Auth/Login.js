import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAPI } from '../../api/api';
import { loginSuccess } from '../../store/slices/authSlice';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      if (response.data.success) {
        dispatch(loginSuccess({
          token: response.data.token,
          user: response.data.user,
        }));
        toast.success('Login successful!');
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-purple rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 ">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className='border bg-gray-900 text-white font-extrabold text-lg rounded-xl py-3 px-6'>C</span>
            <span className="text-4xl font-bold">CartVerse</span>
          </Link>
          <h1 className="text-3xl font-bold text-center mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-500 text-center text-lg max-w-md">
            Sign in to access your account, track orders, and discover amazing tech deals.
          </p>
          
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className='border bg-gray-900 text-white font-extrabold text-lg rounded-xl py-3 px-6'>C</span>
              <span className="text-4xl font-bold">CartVerse</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign in
            </h2>
            <p className="mt-2 text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          <form className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="relative">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                disabled={loading}
                className="btn-glow"
              >
                Sign in
              </Button>
            </div>

          </form>
        </div>
        </div>
    </div>
  );
};

export default Login;
