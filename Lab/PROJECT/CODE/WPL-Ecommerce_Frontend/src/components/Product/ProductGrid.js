import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-100 skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-100 rounded skeleton w-1/3" />
              <div className="h-4 bg-gray-100 rounded skeleton" />
              <div className="h-3 bg-gray-100 rounded skeleton w-2/3" />
              <div className="flex justify-between pt-2">
                <div className="h-5 bg-gray-100 rounded skeleton w-16" />
                <div className="h-8 bg-gray-100 rounded skeleton w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
