import React, { useEffect, useState } from 'react';
import { adminAPI, authAPI, productsAPI } from '../../api/api';
import Loader from '../../components/UI/Loader';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data?.products || res.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    try {
      const response = await adminAPI.deleteProduct(deleteModal.product._id);
      toast.success(response.data.message || "Deleted")
      setProducts(products.filter(p => p._id !== deleteModal.product._id));
      setDeleteModal({ open: false, product: null });
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <span className="text-sm text-gray-500">{products.length} total</span>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden sm:table-cell">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden md:table-cell">Stock</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img src={productsAPI.getPhoto(product._id)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-gray-900 line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden sm:table-cell">${product.price?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm hidden md:table-cell">
                      <span className={product.availableStock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.availableStock > 0 ? `${product.availableStock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setDeleteModal({ open: true, product })}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Delete Product"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{deleteModal.product?.name}"?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteModal({ open: false, product: null })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProducts;
