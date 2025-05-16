import React, { useState, useEffect, useRef } from "react";
import { client } from "../sanity/lib/client";
import Product from "../components/Product";
import QuickView from "../components/QuickView";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Head from 'next/head';

const ProductsPage = ({ products, categories }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [visibleCount, setVisibleCount] = useState(9);

  const sidebarRef = useRef(null);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const showMoreProducts = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  return (
    
    <div className="page-container">

      <button className="filter-toggle-button" onClick={toggleSidebar}>
        {isSidebarOpen ? (
          <>
            Filters
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-plus"
            >
              <line x1="12" x2="12" y1="5" y2="19"></line>
              <line x1="5" x2="19" y1="12" y2="12"></line>
            </svg>
          </>
        ) : (
          <>
            Filters
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-plus"
            >
              <line x1="12" x2="12" y1="5" y2="19"></line>
              <line x1="5" x2="19" y1="12" y2="12"></line>
            </svg>
          </>
        )}
      </button>

      <div
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
      >
        <div className="close-button-container">
          <button className="close-button" onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        <div className="filter-section">
          <h3 className="filter-title">Categories</h3>
          <hr className="separator" />
          <div className="filter-options">
            {categories &&
              categories.map((category, index) => (
                <button
                  key={index}
                  type="button"
                  className={`filter-button ${
                    selectedCategories.includes(category) ? "selected" : ""
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
          </div>
          <hr className="separator" />
          <h3 className="filter-title">Gamme de prix</h3>
          <div className="filter-options">
            <div className="price-range-values">
              <span>{priceRange[0]}DT</span> - <span>{priceRange[1]}DT</span>
            </div>
            <Slider
              range
              min={0}
              max={1000}
              defaultValue={priceRange}
              onChange={handlePriceChange}
              trackStyle={{ backgroundColor: "#324d67" }}
              handleStyle={{ borderColor: "#324d67" }}
              railStyle={{ backgroundColor: "#d9d9d9" }}
            />
          </div>
          <hr className="separator" />
        </div>
      </div>

      <div className="products-container">
        {filteredProducts.slice(0, visibleCount).map((product) => (
          <Product
            key={product._id}
            product={product}
            onQuickView={handleQuickView}
          />
        ))}
        {visibleCount < filteredProducts.length && (
          <div className="show-more-container">
            <button onClick={showMoreProducts} className="show-more-button">
              Afficher plus
            </button>
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <style jsx>{`
        .products-container {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          width: 80%;
          margin: 0 auto;
          justify-content: center;
          transition: all 0.5s ease-in-out;
          position: relative;
        }
        .filter-button.selected {
          border: 2px solid #000;
        }
        .price-range-values {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
        .rc-slider-track {
          background-color: #324d67 !important;
        }
        .rc-slider-handle {
          border-color: #324d67 !important;
        }
        .show-more-container {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 20px;
          position: absolute;
          bottom: -50px; /* Adjust this value as needed */
        }
        .show-more-button {
          padding: 10px 20px;
          background-color: #324d67;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 10px;
        }
        .show-more-button:hover {
          background-color: #273a4d;
        }
      `}</style>
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
