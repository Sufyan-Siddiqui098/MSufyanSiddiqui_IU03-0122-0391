import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../api/api';
import ProductGrid from '../components/Product/ProductGrid';
import Loader from '../components/UI/Loader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll().catch(() => ({ data: { success: false, products: [] } })),
        categoriesAPI.getAll().catch(() => ({ data: { success: false, categories: [] } })),
      ]);

      if (productsRes.data.success) setProducts(productsRes.data.products.slice(0, 8));
      if (categoriesRes.data.success) setCategories(categoriesRes.data.categories);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Quality products, delivered to you</h1>
            <p className="text-gray-400 text-lg mb-8">Discover our collection of carefully selected products at great prices.</p>
            <Link to="/products" className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-gray-900 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            View All 
          </Link>
        </div>
        {loading ? <Loader size="lg" /> : <ProductGrid products={products} loading={false} />}
      </section>
    </div>
  );
};

export default Home;
