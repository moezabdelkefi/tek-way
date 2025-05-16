import React, { useState, useEffect, useRef } from "react";
import { client } from "../sanity/lib/client";
import Product from "../components/Product";
import QuickView from "../components/QuickView";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Head from "next/head";
import { FiFilter, FiX } from "react-icons/fi";

const ProductsPage = ({ products, categories }) => {
  // State management
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Calculate min and max price from products
  const maxPrice = Math.ceil(Math.max(...products.map((p) => p.price), 1000));
  const minPrice = Math.floor(Math.min(...products.map((p) => p.price), 0));

  // Initialize price range with actual product prices
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Filter products based on selected criteria
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  // Category filter handler
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Price range handler
  const handlePriceChange = (range) => {
    setPriceRange(range);
  };

  // Other handlers
  const handleQuickView = (product) => setQuickViewProduct(product);
  const toggleMobileFilters = () => setIsMobileFilterOpen(!isMobileFilterOpen);
  const showMoreProducts = () => setVisibleCount((prev) => prev + 8);

  // Count active filters
  const activeFilterCount =
    selectedCategories.length +
    (priceRange[0] > minPrice || priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Our Products | Your Store Name</title>
        <meta
          name="description"
          content="Browse our collection of high-quality products"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Button - Only shown on mobile */}
        <div className="lg:hidden mb-6">
          <button
            onClick={toggleMobileFilters}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium"
          >
            <FiFilter />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#cb6ce6] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters - Always visible on desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-4 h-[calc(100vh-32px)] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>

              {/* Categories Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategories.includes(category)
                          ? "bg-[#cb6ce6] text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Price Range (DT)
                </h3>
                <div className="px-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{priceRange[0]}</span>
                    <span>{priceRange[1]}</span>
                  </div>
                  <Slider
                    range
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={handlePriceChange}
                    trackStyle={{ backgroundColor: "#2563eb" }}
                    handleStyle={{
                      borderColor: "#2563eb",
                      boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
                    }}
                    railStyle={{ backgroundColor: "#e5e7eb" }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([minPrice, maxPrice]);
                }}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
              >
                Reset all filters
              </button>
            </div>
          </div>

          {/* Mobile Filters Panel - Only shown when toggled */}
          {isMobileFilterOpen && (
            <div className="lg:hidden mb-6 bg-white p-4 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                  onClick={toggleMobileFilters}
                  className="text-gray-500 hover:text-gray-700 p-1 -mr-2"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedCategories.includes(category)
                          ? "bg-[#cb6ce6] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Price Range (DT)
                </h3>
                <div className="px-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{priceRange[0]}</span>
                    <span>{priceRange[1]}</span>
                  </div>
                  <Slider
                    range
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={handlePriceChange}
                    trackStyle={{ backgroundColor: "#2563eb" }}
                    handleStyle={{
                      borderColor: "#2563eb",
                      boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
                    }}
                    railStyle={{ backgroundColor: "#cb6ce6" }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([minPrice, maxPrice]);
                }}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Our Products
              </h1>
              <p className="text-gray-600">
                Showing {Math.min(visibleCount, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([minPrice, maxPrice]);
                  }}
                  className="px-4 py-2 bg-[#cb6ce6] text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.slice(0, visibleCount).map((product) => (
                    <Product
                      key={product._id}
                      product={product}
                      onQuickView={handleQuickView}
                    />
                  ))}
                </div>

                {visibleCount < filteredProducts.length && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={showMoreProducts}
                      className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  const productsQuery = '*[_type == "product"]';
  const products = await client.fetch(productsQuery);

  // Filter out undefined categories
  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  return {
    props: {
      products,
      categories,
    },
  };
};

export default ProductsPage;
