import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productsAPI } from '../api/api';
import { addToCartAsync, selectCartLoading } from '../store/slices/cartSlice';
import Loader from '../components/UI/Loader';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartLoading = useSelector(selectCartLoading);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      if (response.data.success) setProduct(response.data.product);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async() => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (product.availableStock < 1) {
      toast.error('This product is out of stock');
      return;
    }
    dispatch(addToCartAsync({ productId: product._id, quantity }));
    setProduct({...product, availableStock: product.availableStock - quantity});
    setQuantity(0);
  };

  if (loading) return <Loader fullScreen />;
  if (!product) return null;

  const imageUrl = product._id ? productsAPI.getPhoto(product._id) : null;
  const isOutOfStock = product.availableStock < 1;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-900">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.category?.name && (
              <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
            )}
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <p className="text-3xl font-bold text-gray-900 mb-4">${product.price?.toFixed(2)}</p>
            
            {/* Stock Status */}
            <p className={`text-sm mb-6 ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of Stock' : `In Stock (${product.availableStock} available)`}
            </p>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  >
                    
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => quantity < product.availableStock && setQuantity(q => q + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || cartLoading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {cartLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : `Add to Cart  $${(product.price * quantity).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
