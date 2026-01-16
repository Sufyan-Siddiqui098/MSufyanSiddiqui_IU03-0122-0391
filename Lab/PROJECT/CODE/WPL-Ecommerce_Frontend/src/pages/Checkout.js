import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, selectCartTotal } from '../store/slices/cartSlice';
import { orderAPI } from '../api/api';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const total = useSelector(selectCartTotal);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone || '',
    address: '',
    city: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await orderAPI.create(formData);
      if (response.data.success) {
        toast.success('Order placed successfully!');
        dispatch(fetchCart()); // refresh cart (should be empty now)
        navigate('/orders');
      }
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="text-gray-900 font-medium underline">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Info */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Method</h2>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-4 h-4 border-4 border-gray-900 rounded-full"></div>
                <span className="text-sm text-gray-700">Cash on Delivery</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Pay when you receive your order</p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id || item.product?._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product?.name} x {item.quantity}</span>
                    <span className="text-gray-900">${(item.priceAtAddition * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
