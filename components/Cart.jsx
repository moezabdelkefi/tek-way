import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import { urlFor } from "@/sanity/lib/image";

const Cart = () => {
  const router = useRouter();
  const cartRef = useRef();
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const {
    totalQuantities,
    cartItems,
    setShowCart,
    setCartItems,
    toggleCartItemQuanitity,
    onRemove,
  } = useStateContext();

  const calculateDiscountedPrice = (item) => {
    return item.discount
      ? (item.price - (item.price * item.discount) / 100).toFixed(2)
      : item.price;
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = calculateDiscountedPrice(item);
      return total + item.quantity * Number(discountedPrice);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartRef, setShowCart]);

  const handleCheckout = () => {
    setIsAnimating(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleContinue = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    const orderDetails = cartItems
      .map(
        (item) => `
        Product: ${item.name}
        Quantity: ${item.quantity}
        Price: ${item.price}DT
        Discount: ${item.discount}%
        Discounted Price: ${calculateDiscountedPrice(item)}DT
        Phone: ${phoneNumber}
      `
      )
      .join("\n");

    try {
      const clientResponse = await axios.post("/api/sendEmail", {
        email: email,
        subject: "Order Confirmation",
        message: "Thank you for your order",
      });

      const ownerResponse = await axios.post("/api/sendEmail", {
        email: "sfaxiyosr@gmail.com",
        subject: "New Order",
        message: `Client Email: ${email}\n\n${orderDetails}`,
      });

      if (clientResponse.status === 200 && ownerResponse.status === 200) {
        toast.success("Order placed successfully");
        setCartItems([]);
        setShowCart(false);
        router.push("/");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div 
      ref={cartRef}
      className="fixed inset-0 w-full h-full bg-black bg-opacity-50 z-50 transition-opacity duration-300"
    >
      <div className="absolute right-0 h-full w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white shadow-xl overflow-y-auto transition-transform duration-300">
        {/* Cart Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <button 
            onClick={() => setShowCart(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <AiOutlineLeft size={20} />
            <span className="font-semibold">Your Cart</span>
          </button>
          <span className="text-sm text-gray-500">
            ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
          </span>
        </div>

        {/* Empty Cart */}
        {cartItems.length < 1 && (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AiOutlineShopping size={100} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-4">Your Cart is Empty</h3>
            <Link href="/">
              <button
                onClick={() => setShowCart(false)}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        {/* Cart Items */}
        <div className="divide-y">
          {cartItems.map((item) => (
            <div key={`${item._id}-${item.size}`} className="p-4 flex gap-4">
              <img 
                src={urlFor(item?.image[0])} 
                className="w-20 h-20 object-cover rounded"
                alt={item.name}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h5 className="font-medium">{item.name}</h5>
                  <div className="text-right">
                    {item.discount ? (
                      <>
                        <span className="line-through text-gray-400 mr-1">
                          {item.price}DT
                        </span>
                        <span className="font-semibold">
                          {calculateDiscountedPrice(item)}DT
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold">{item.price}DT</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center border rounded-full">
                    <button
                      onClick={() => toggleCartItemQuanitity(item._id, item.size, "dec")}
                      className="px-2 py-1 text-gray-500 hover:text-black"
                    >
                      <AiOutlineMinus size={16} />
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() => toggleCartItemQuanitity(item._id, item.size, "inc")}
                      className="px-2 py-1 text-gray-500 hover:text-black"
                    >
                      <AiOutlinePlus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemove(item)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TiDeleteOutline size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Footer */}
        {cartItems.length >= 1 && (
          <div className="p-4 border-t sticky bottom-0 bg-white">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Subtotal:</h3>
              <h3 className="font-bold">{totalPrice}DT</h3>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Enter Your Details</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleContinue}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;