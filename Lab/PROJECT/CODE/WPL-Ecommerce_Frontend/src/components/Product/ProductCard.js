import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productsAPI } from '../../api/api';
import { addToCartAsync, selectCartLoading } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartLoading = useSelector(selectCartLoading);

  const imageUrl = product._id ? productsAPI.getPhoto(product._id) : null;
  const isOutOfStock = product.availableStock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/product/${product._id}`} className="block">
        <div className="aspect-square bg-gray-100 relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-50' : ''}`}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">Out of Stock</div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {product.category?.name && (
          <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
        )}
        
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:underline">{product.name}</h3>
        </Link>
        
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">${product.price?.toFixed(2)}</span>
          
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || cartLoading}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
