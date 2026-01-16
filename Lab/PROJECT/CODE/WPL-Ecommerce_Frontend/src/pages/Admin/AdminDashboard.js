import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI, adminAPI } from '../../api/api';
import Loader from '../../components/UI/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, usersRes] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll(),
          adminAPI.getAllUsers()
        ]);
        setStats({
          products: productsRes.data?.products?.length || productsRes.data?.length || 0,
          categories: categoriesRes.data.categories?.length || 0,
          users: usersRes.data.users?.length || 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader fullScreen />;

  const cards = [
    { label: 'Products', value: stats.products, link: '/admin/products' },
    { label: 'Categories', value: stats.categories, link: '/admin/categories' },
    { label: 'Users', value: stats.users, link: '/admin/users' }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.link}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300"
            >
              <p className="text-sm text-gray-500 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/admin/products" className="py-3 px-4 text-center bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            Manage Products
          </Link>
          <Link to="/admin/categories" className="py-3 px-4 text-center bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            Manage Categories
          </Link>
          <Link to="/admin/users" className="py-3 px-4 text-center bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
