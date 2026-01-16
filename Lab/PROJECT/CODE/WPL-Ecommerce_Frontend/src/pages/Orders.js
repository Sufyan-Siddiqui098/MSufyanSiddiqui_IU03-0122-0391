import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../api/api';
import Loader from '../components/UI/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'accepted') return 'text-green-600 bg-green-50';
    if (status === 'cancelled') return 'text-red-600 bg-red-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
            <Link to="/products" className="text-gray-900 font-medium underline">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product?.name || 'Product'} x {item.quantity}
                      </span>
                      <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-sm text-gray-500">
                    Seller: {order.seller?.firstName} {order.seller?.lastName}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>
                </div>

                {order.status === 'accepted' && (
                  <p className="mt-3 text-xs text-green-600">
                    Your order will be delivered within 2 working days.
                  </p>
                )}
                {order.status === 'cancelled' && (
                  <p className="mt-3 text-xs text-red-600">
                    This order was cancelled by the seller.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
