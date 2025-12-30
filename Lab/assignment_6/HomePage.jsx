import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ShoppingBag, TrendingUp, Star } from 'lucide-react';
import { fetchProducts, selectAllProducts, selectProductsLoading } from '../store/slices/productSlice';
import { fetchCategories, selectCategories } from '../store/slices/categorySlice';
import { ProductGrid } from '../components/products';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
        <div className="relative px-6 py-20 md:px-12 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-display">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Shop the latest trends with unbeatable prices and fast shipping
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" variant="secondary" icon={ShoppingBag}>
                  Shop Now
                </Button>
              </Link>
              <Link to="/shop?sort=newest">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 font-display">Shop by Category</h2>
              <p className="text-secondary-600 mt-2">Browse our diverse collection</p>
            </div>
            <Link to="/shop">
              <Button variant="ghost" icon={ArrowRight} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${category._id}`}
                className="group"
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <ShoppingBag className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 font-display">Featured Products</h2>
            <p className="text-secondary-600 mt-2">Handpicked items just for you</p>
          </div>
          <Link to="/shop">
            <Button variant="ghost" icon={ArrowRight} iconPosition="right">
              View All Products
            </Button>
          </Link>
        </div>
        <ProductGrid products={featuredProducts} isLoading={isLoading} />
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success-100 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Best Prices</h3>
          <p className="text-secondary-600">
            Competitive pricing on all products with price match guarantee
          </p>
        </Card>
        <Card className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Fast Shipping</h3>
          <p className="text-secondary-600">
            Free shipping on orders over $100 with quick delivery times
          </p>
        </Card>
        <Card className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent-100 flex items-center justify-center">
            <Star className="w-7 h-7 text-accent-600" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Quality Products</h3>
          <p className="text-secondary-600">
            Carefully curated selection of high-quality products
          </p>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl px-6 py-16 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
          Start Shopping Today
        </h2>
        <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers and discover your next favorite product
        </p>
        <Link to="/shop">
          <Button size="lg" variant="secondary">
            Browse Products
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
