import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">CartVerse</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your trusted online shopping destination for quality products.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm text-gray-600 hover:text-gray-900">All Products</Link></li>
              <li><Link to="/cart" className="text-sm text-gray-600 hover:text-gray-900">Shopping Cart</Link></li>
              <li><Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">My Account</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-600">help@cartverse.com</span></li>
              <li><span className="text-sm text-gray-600">+1 (555) 123-4567</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
             {new Date().getFullYear()} CartVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
