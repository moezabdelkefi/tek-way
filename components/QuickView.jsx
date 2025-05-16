import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { urlFor } from "@/sanity/lib/image";
import { useStateContext } from "@/context/StateContext";

const QuickView = ({ product, onClose }) => {
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleBuyNow = () => {
    onAdd(product, qty);
    setShowCart(true);
    handleClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!product) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const truncateDescription = (description, wordLimit) => {
    if (!description) return "";
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        ref={containerRef}
        className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Close quick view"
        >
          <AiOutlineClose className="text-gray-600 text-lg" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden">
              {product.image?.[index] && (
                <img
                  src={urlFor(product.image[index])}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.image?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.image.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      i === index
                        ? "border-purple-500 ring-2 ring-purple-200"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={urlFor(item)}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>

            {product.details && (
              <p className="text-gray-600">
                {truncateDescription(product.details, 35)}
              </p>
            )}

            <div className="border-t border-b border-gray-200 py-4">
              {/* Price Display */}
              <div className="flex items-center gap-3">
                {product.discount ? (
                  <>
                    <span className="text-2xl font-bold text-purple-600">
                      {(
                        product.price -
                        (product.price * product.discount) / 100
                      ).toFixed(2)}
                      DT
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {product.price}DT
                    </span>
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                      -{product.discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price}DT
                  </span>
                )}
              </div>

              {/* Category */}
              {product.category && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {product.category}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium text-gray-700">Quantité:</p>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decQty}
                  className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <AiOutlineMinus />
                </button>
                <span className="px-4 py-2 text-gray-900">{qty}</span>
                <button
                  onClick={incQty}
                  className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <AiOutlinePlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                onClick={() => onAdd(product, qty)}
                className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300"
              >
                Ajouter Au Panier
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-3 px-6 bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium rounded-lg transition-colors duration-300"
              >
                Acheter Maintenant
              </button>
            </div>

            {/* Product Features */}
            {product.features?.length > 0 && (
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Caractéristiques
                </h3>
                <ul className="space-y-2 pl-5 list-disc text-gray-600">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
