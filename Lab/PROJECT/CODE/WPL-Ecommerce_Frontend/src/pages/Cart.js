import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateCartItemAsync,
  removeFromCartAsync,
  selectCartTotal,
} from "../store/slices/cartSlice";
import { productsAPI } from "../api/api";
import Loader from "../components/UI/Loader";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your cart</p>
          <Link to="/login" className="text-gray-900 font-medium underline">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading && items.length === 0) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="text-gray-900 font-medium underline"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const product = item.product;
                  const imageUrl = product?._id
                    ? productsAPI.getPhoto(product._id)
                    : null;

                  return (
                    <div
                      key={item._id || product?._id}
                      className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={product?.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${product?._id}`}
                          className="text-sm font-medium text-gray-900 hover:underline line-clamp-1"
                        >
                          {product?.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.priceAtAddition?.toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              dispatch(
                                updateCartItemAsync({
                                  productId: product._id,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 border border-gray-300 rounded text-gray-600 disabled:opacity-50"
                          ></button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateCartItemAsync({
                                  productId: product._id,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            className="w-8 h-8 border border-gray-300 rounded text-gray-600"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              dispatch(removeFromCartAsync(product._id))
                            }
                            className="ml-auto text-sm text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-semibold text-gray-900">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
            <div></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
