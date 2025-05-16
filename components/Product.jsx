import React from 'react';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';

const Product = ({ product, onQuickView }) => {
  const { image, name, price, slug, discount } = product;
  const discountedPrice = discount ? (price - (price * discount / 100)).toFixed(2) : price;

  return (
    <div className="relative w-64 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
      {/* Quick View Button */}
      <button 
        onClick={() => onQuickView(product)} 
        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
        aria-label="Quick view"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-gray-600"
        >
          <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"></path>
          <path d="M3 16.2V21m0 0h4.8M3 21l6-6"></path>
          <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"></path>
          <path d="M3 7.8V3m0 0h4.8M3 3l6 6"></path>
        </svg>
      </button>

      {/* Product Image */}
      <Link href={`/product/${slug.current}`}>
        <div className="mb-3 overflow-hidden rounded-lg aspect-square">
          <img 
            src={urlFor(image && image[0])}
            width={250}
            height={250}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            alt={name}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-2 space-y-1">
        <h3 className="font-medium text-gray-900 line-clamp-2 h-12">
          <Link href={`/product/${slug.current}`}>
            {name}
          </Link>
        </h3>
        
        <div className="flex items-center gap-2">
          {discount ? (
            <>
              <span className="text-gray-400 line-through">{price}DT</span>
              <span className="font-bold text-red-600">{Number(discountedPrice)}DT</span>
              <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                -{discount}%
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900">{price}DT</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;