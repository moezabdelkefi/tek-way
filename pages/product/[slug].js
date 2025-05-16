import React, { useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { client, urlFor } from "../../sanity/lib/client.js";
import { Product, QuickView } from "../../components";
import { useStateContext } from "../../context/StateContext";
import Link from "next/link";
import { toast } from "react-hot-toast";

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, category, discount } = product;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleBuyNow = () => {
    onAdd(product, qty);
    setShowCart(true);
  };

  const discountedPrice = discount
    ? (price - (price * discount) / 100).toFixed(2)
    : price;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const form = e.target;
    const formData = new FormData(form);
    const data = {
      email: "moezabdelkefi17@gmail.com",
      subject: "Nouvelle Commande",
      message: `
                Nom: ${formData.get("nom")}
                Prénom: ${formData.get("prenom")}
                Numéro de téléphone: ${formData.get("numero")}
                État: ${formData.get("state")}
                Adresse: ${formData.get("adresse")}
                Quantité: ${qty}
                Nom De Produit: ${name}
                Prix Unitaire: ${price}DT
                prix de vente apres promotion : ${discountedPrice}DT
                Quantité: ${qty}
                Prix Total: ${(discountedPrice * qty).toFixed(2)}DT
              `,
      price: discountedPrice,
    };

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Commande envoyée avec succès !");
        form.reset();
      } else {
        const errorData = await response.json();
        toast.error("Échec de l'envoi de la commande. Veuillez réessayer.");
      }
    } catch (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiOutlineStar />
          </div>
        </div>
        <h1 className="text-3xl font-bold mt-1">{name}</h1>
      </div>
      {/* Top Section - Image and Form Side by Side */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Product Image */}
        <div className="lg:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <img
              src={urlFor(image && image[index])}
              className="w-full h-auto max-h-[500px] object-contain"
              alt={name}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={`w-16 h-16 object-cover cursor-pointer rounded border-2 ${
                  i === index ? "border-blue-500" : "border-gray-200"
                }`}
                onMouseEnter={() => setIndex(i)}
                alt={`${name} thumbnail ${i}`}
              />
            ))}
          </div>
        </div>

        {/* Order Form */}
        <div className="lg:w-1/2">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-full">
            <h3 className="text-xl font-bold text-center mb-6">
              Commander Maintenant
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom: اسم
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label
                    htmlFor="prenom"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Prénom: القب
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="numero"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Numéro de téléphone: رقم التليفون
                </label>
                <input
                  type="tel"
                  id="numero"
                  name="numero"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  État / ولاية
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black bg-white"
                >
                  <option value="">Sélectionnez un état</option>
                  <option value="Ariana">أريانة</option>
                  <option value="Beja">باجة</option>
                  <option value="Ben Arous">بن عروس</option>
                  <option value="Bizerte">بنزرت</option>
                  <option value="Gabes">قابس</option>
                  <option value="Gafsa">قفصة</option>
                  <option value="Jendouba">جندوبة</option>
                  <option value="Kairouan">القيروان</option>
                  <option value="Kasserine">القصرين</option>
                  <option value="Kebili">قبلي</option>
                  <option value="Kef">الكاف</option>
                  <option value="Mahdia">المهدية</option>
                  <option value="Manouba">منوبة</option>
                  <option value="Medenine">مدنين</option>
                  <option value="Monastir">المنستير</option>
                  <option value="Nabeul">نابل</option>
                  <option value="Sfax">صفاقس</option>
                  <option value="Sidi Bouzid">سيدي بوزيد</option>
                  <option value="Siliana">سليانة</option>
                  <option value="Sousa">سوسة</option>
                  <option value="Tataouine">تطاوين</option>
                  <option value="Tozeur">توزر</option>
                  <option value="Tunis">تونس</option>
                  <option value="Zaghouan">زغوان</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="adresse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse: العنوان
                </label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité: الكمية
                </label>
                <div className="flex items-center border border-gray-300 rounded-full w-fit">
                  <button
                    type="button"
                    onClick={decQty}
                    className="px-3 py-1 text-gray-500 hover:text-black"
                  >
                    <AiOutlineMinus />
                  </button>
                  <span className="px-3">{qty}</span>
                  <button
                    type="button"
                    onClick={incQty}
                    className="px-3 py-1 text-gray-500 hover:text-black"
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 rounded-md text-white font-bold ${
                  isProcessing
                    ? "bg-gray-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-600 hover:bg-gray-800"
                } transition-colors`}
              >
                {isProcessing ? "Traitement..." : "Commander -إتمام الشراء"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              frais de livraison - 8.00 dt - التوصيل
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section - Product Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <div className="prose max-w-none">
            {details ? (
              <p
                className={`whitespace-pre-line text-gray-700 leading-relaxed text-[18px] md:text-[20px] ${
                  /[\u0600-\u06FF]/.test(details) ? "text-right" : "text-left"
                }`}
              >
                {details}
              </p>
            ) : (
              <p>Aucune description disponible.</p>
            )}
          </div>
        </div>
        <div className="mb-6"></div>
        <Link
          href={`/products?category=${category}`}
          className="text-[#cb6ce6] font-bold hover:underline text-sm px-4 py-2"
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: "12px",
            display: "inline-block",
          }}
        >
          {category}
        </Link>
        <p className="price">
          {discount ? (
            <>
              <span
                className="original-price"
                style={{ textDecoration: "line-through" }}
              >
                {price}DT
              </span>
              <span className="discounted-price">
                /{Number(discountedPrice)}DT
              </span>
            </>
          ) : (
            `${price}DT`
          )}
        </p>
        <div className="buttons">
          <button
            type="button"
            className="add-to-cart"
            onClick={() => onAdd(product, qty)}
          >
            Ajouter Au Panier
          </button>
        </div>
      </div>
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={closeQuickView} />
      )}
      <div className="maylike-products-wrapper">
        <h2 className="text-[#cb6ce6] text-2xl md:text-3xl font-bold mb-6">
          Autres Articles
        </h2>

        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product
                key={item._id}
                product={item}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]{
    _id,
    name,
    details,
    price,
    category,
    image,
    discount
  }`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return { props: { products, product } };
};

export default ProductDetails;
