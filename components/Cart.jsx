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
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import { urlFor } from "@/sanity/lib/image";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const router = useRouter();
  const cartRef = useRef();
  const modalRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (
        cartRef.current && 
        !cartRef.current.contains(event.target) &&
        (!isModalOpen || (modalRef.current && !modalRef.current.contains(event.target)))
      ) {
        setShowCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, setShowCart]);

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleContinue = async () => {
    if (!firstName) {
      toast.error("Veuillez entrer votre prénom");
      return;
    }
    if (!lastName) {
      toast.error("Veuillez entrer votre nom");
      return;
    }
    if (!phoneNumber) {
      toast.error("Veuillez entrer votre numéro de téléphone");
      return;
    }
    if (!state) {
      toast.error("Veuillez sélectionner votre état");
      return;
    }
    if (!address) {
      toast.error("Veuillez entrer votre adresse");
      return;
    }

    setIsSubmitting(true);

    const orderDetails = `
      Nouvelle Commande  
      Client: ${firstName} ${lastName}  
      Téléphone: ${phoneNumber}  
      État: ${state}  
      Adresse: ${address}  

      Produits:  
      ${cartItems.map(item => `
      - ${item.name} (${item.quantity}x): ${calculateDiscountedPrice(item)}DT`).join('\n')}

      Total: ${totalPrice}DT
    `;

    try {
      const response = await axios.post("/api/sendEmail", {
        subject: `Nouvelle Commande - ${firstName} ${lastName}`,
        message: orderDetails,
        price: totalPrice
      });

      if (response.data.success) {
        toast.success("Commande passée avec succès!");
        setCartItems([]);
        setIsModalOpen(false);
        setShowCart(false);
        router.push("/");
      } else {
        throw new Error(response.data.message || "Erreur du serveur");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Échec de la commande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const cartVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: { type: "spring", damping: 25 }
    },
    exit: { x: "100%" }
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { scale: 0.9, opacity: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        className="fixed inset-0 w-full h-full bg-black bg-opacity-50 z-50"
      >
        <motion.div
          ref={cartRef}
          variants={cartVariants}
          className="absolute right-0 h-full w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white shadow-xl overflow-y-auto"
        >
          {/* Cart Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <button 
              onClick={() => setShowCart(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <AiOutlineLeft size={20} />
              <span className="font-semibold">Votre Panier</span>
            </button>
            <span className="text-sm text-gray-500">
              ({cartItems.length} {cartItems.length === 1 ? "article" : "articles"})
            </span>
          </div>

          {/* Empty Cart */}
          {cartItems.length < 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <AiOutlineShopping size={100} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-4">Votre panier est vide</h3>
              <Link href="/">
                <button
                  onClick={() => setShowCart(false)}
                  className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  Continuer vos achats
                </button>
              </Link>
            </motion.div>
          )}

          {/* Cart Items */}
          <div className="divide-y">
            {cartItems.map((item) => (
              <motion.div 
                key={`${item._id}-${item.size}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 flex gap-4"
              >
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
                        className="px-2 py-1 text-gray-500 hover:text-black transition-colors"
                      >
                        <AiOutlineMinus size={16} />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => toggleCartItemQuanitity(item._id, item.size, "inc")}
                        className="px-2 py-1 text-gray-500 hover:text-black transition-colors"
                      >
                        <AiOutlinePlus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TiDeleteOutline size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Footer */}
          {cartItems.length >= 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-t sticky bottom-0 bg-white"
            >
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Total:</h3>
                <h3 className="font-bold">{totalPrice}DT</h3>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors"
              >
                Passer la commande
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Checkout Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <motion.div
                ref={modalRef}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative mx-4"
              >
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Informations Client</h2>
                
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom / الاسم الأول
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Entrez votre prénom"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom / اللقب
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Entrez votre nom"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone / رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Entrez votre numéro"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      État / الولاية
                    </label>
                    <select 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      required
                    >
                      <option value="">Sélectionnez un état</option>
                      <option value="tunis">Tunis</option>
                      <option value="sfax">Sfax</option>
                      <option value="sousse">Sousse</option>
                      <option value="kairouan">Kairouan</option>
                      <option value="bizerte">Bizerte</option>
                      <option value="gabes">Gabes</option>
                      <option value="ariana">Ariana</option>
                      <option value="gafsa">Gafsa</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse / العنوان
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Entrez votre adresse complète"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <button
                    onClick={handleContinue}
                    disabled={isSubmitting}
                    className={`w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors mt-4 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Traitement...
                      </span>
                    ) : "Confirmer la commande"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default Cart;