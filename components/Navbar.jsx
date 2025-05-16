import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Cart } from "./";
import { useStateContext } from "../context/StateContext";
import { client, urlFor } from "@/sanity/lib/client";

const Navbar = () => {
  const {
    showCart,
    setShowCart,
    totalQuantities,
    cartItems,
    setTotalQuantities,
  } = useStateContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchFormRef = useRef(null);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantities(total);
  }, [cartItems]);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      const query = `*[_type == "product" && name match '${searchQuery}*']{
        _id,
        name,
        slug,
        price,
        image
      }`;
      const results = await client.fetch(query);
      setSearchResults(results);
    };

    fetchResults();
  }, [searchQuery]);

  const handleProductClick = () => {
    setSearchResults([]);
    setSearchQuery("");
    setIsSearchVisible(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const handleClickOutside = (event) => {
    if (
      searchFormRef.current &&
      !searchFormRef.current.contains(event.target)
    ) {
      setIsSearchVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-black shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo - Made significantly larger */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <img
                  src="/logoment.png"
                  alt="Art Gallerie"
                  className="h-24 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Navigation Center */}
            <div className="flex-1 flex items-center justify-center">
              <div className="hidden md:flex space-x-8">
                <Link
                  href="/products"
                  className="text-gray-200 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Produits
                </Link>
              </div>

              {/* Search Bar */}
              <div className="ml-8 relative w-full max-w-md">
                <form
                  className="relative"
                  onSubmit={handleSearch}
                  ref={searchFormRef}
                >
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchVisible(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-800 text-white"
                  />
                  {isSearchVisible && searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg rounded-md border border-gray-700 max-h-96 overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          href={`/product/${product.slug.current}`}
                          className="flex items-center p-3 hover:bg-gray-700 transition-colors duration-150"
                          onClick={handleProductClick}
                        >
                          <img
                            src={urlFor(product.image[0])}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md mr-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-white">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-300">
                              ${product.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Cart Button */}
            <div className="flex items-center">
              <button
                type="button"
                className="relative p-2 text-gray-200 hover:text-white focus:outline-none transition-colors duration-200"
                onClick={() => setShowCart(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" x2="21" y1="6" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {totalQuantities > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#cb6ce6] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalQuantities}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showCart && <Cart />}
    </>
  );
};

export default Navbar;
