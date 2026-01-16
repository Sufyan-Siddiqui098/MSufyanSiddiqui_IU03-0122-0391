import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import PrivateRoute from './components/Routes/PrivateRoute';
import AdminRoute from './components/Routes/AdminRoute';
import SellerRoute from './components/Routes/SellerRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminUsers from './pages/Admin/AdminUsers';
import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerProducts from './pages/Seller/SellerProducts';
import SellerOrders from './pages/Seller/SellerOrders';
import AddProduct from './pages/Seller/AddProduct';
import EditProduct from './pages/Seller/EditProduct';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        
        {/* Admin Routes */}
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        
        {/* Seller Routes */}
        <Route path="seller" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
        <Route path="seller/products" element={<SellerRoute><SellerProducts /></SellerRoute>} />
        <Route path="seller/orders" element={<SellerRoute><SellerOrders /></SellerRoute>} />
        <Route path="seller/products/add" element={<SellerRoute><AddProduct /></SellerRoute>} />
        <Route path="seller/products/edit/:id" element={<SellerRoute><EditProduct /></SellerRoute>} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
