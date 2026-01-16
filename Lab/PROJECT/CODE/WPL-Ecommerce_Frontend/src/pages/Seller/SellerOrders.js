import React, { useEffect, useState } from 'react';
import { orderAPI } from '../../api/api';
import Loader from '../../components/UI/Loader';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ open: false, order: null, action: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getSellerOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionModal.order) return;
    try {
      await orderAPI.updateStatus(actionModal.order._id, actionModal.action);
      toast.success(`Order ${actionModal.action}`);
      setOrders(orders.map(o => 
        o._id === actionModal.order._id ? { ...o, status: actionModal.action } : o
      ));
      setActionModal({ open: false, order: null, action: '' });
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <span className="text-sm text-gray-500">{orders.length} total</span>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize w-fit ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Customer info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">Customer</p>
                  <p className="text-sm text-gray-600">{order.buyer?.firstName} {order.buyer?.lastName}</p>
                  <p className="text-sm text-gray-600">{order.buyer?.email}</p>
                  <p className="text-sm text-gray-600">{order.buyer?.phone}</p>
                </div>

                {/* Shipping address */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">Shipping Address</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress?.fullName}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress?.phone}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-900">Items</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product?.name || 'Product'} x {item.quantity}</span>
                      <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm font-medium text-gray-900">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>
                  
                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setActionModal({ open: true, order, action: 'accepted' })}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActionModal({ open: true, order, action: 'cancelled' })}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ open: false, order: null, action: '' })}
        title={actionModal.action === 'accepted' ? 'Accept Order' : 'Cancel Order'}
      >
        <p className="text-gray-600 mb-6">
          {actionModal.action === 'accepted'
            ? 'Are you sure you want to accept this order?'
            : 'Are you sure you want to cancel this order? Stock will be restored.'}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setActionModal({ open: false, order: null, action: '' })}>
            No
          </Button>
          <Button variant={actionModal.action === 'cancelled' ? 'danger' : 'primary'} onClick={handleAction}>
            Yes, {actionModal.action === 'accepted' ? 'Accept' : 'Cancel'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SellerOrders;
