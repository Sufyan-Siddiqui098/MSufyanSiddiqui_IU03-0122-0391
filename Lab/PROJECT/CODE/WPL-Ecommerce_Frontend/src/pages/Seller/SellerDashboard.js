import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { productsAPI, orderAPI } from '../../api/api';
import Loader from '../../components/UI/Loader';

const SellerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          productsAPI.getSellerProducts(),
          orderAPI.getSellerOrders()
        ]);
        setProducts(prodRes.data?.products || prodRes.data || []);
        setOrders(orderRes.data?.orders || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <Link
            to="/seller/products/add"
            className="inline-block py-2 px-4 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800"
          >
            Add Product
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-1">In Stock</p>
            <p className="text-3xl font-bold text-gray-900">
              {products.filter(p => p.availableStock > 0).length}
            </p>
          </div>
          <Link to="/seller/orders" className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300">
            <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
            <p className="text-3xl font-bold text-gray-900">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Products</h2>
          <Link to="/seller/products" className="text-sm text-gray-600 hover:underline">
            View All
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No products yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 6).map((product) => (
              <Link
                key={product._id}
                to={`/seller/products/edit/${product._id}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img src={productsAPI.getPhoto(product._id)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-sm text-gray-500">${product.price?.toFixed(2)}</p>
                    <p className={`text-xs ${product.availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.availableStock > 0 ? `${product.availableStock} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
