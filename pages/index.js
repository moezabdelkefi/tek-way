import React, { useState } from "react";
import Head from "next/head";
import { client } from "../sanity/lib/client";
import HeroBanner from "../components/HeroBanner";
import Product from "../components/Product";
import QuickView from "../components/QuickView";
import TextVideoSection from "../components/TextVideoSection";
import { Advantages } from "@/components";
import AboutUs from "../components/AboutUs";
import Link from "next/link";
import TextVideoSection1 from "@/components/TextVideoSection1";

export async function getStaticProps() {
  const bannerQuery = `*[_type == "banner"]`;
  const productsQuery = `*[_type == "product"] | order(_createdAt desc)`;
  const textVideoSectionQuery = `*[_type == "textVideoSection"]{
    title,
    text,
    "videoUrl": video.asset->url
  }`;
  const aboutUsQuery = `*[_type == "aboutUs"]{title, description, image}`;

  const bannerData = await client.fetch(bannerQuery);
  const products = await client.fetch(productsQuery);
  const textVideoSectionData = await client.fetch(textVideoSectionQuery);
  const aboutUsData = await client.fetch(aboutUsQuery);

  return {
    props: {
      bannerData,
      products,
      textVideoSectionData,
      aboutUsData: aboutUsData[0] || null,
    },
  };
}

const HomePage = ({
  bannerData,
  products,
  textVideoSectionData,
  aboutUsData,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      <div className="products-heading">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
          Derniers Produits
        </h2>
        <p className="text-black">
          Explorez notre collection high-tech : montres connectées, AirPods,
          gadgets et plus encore !
        </p>
      </div>
      <div className="browse-all-container">
        <Link href="/products">
          <p className="browse-all-button">Tous Les Produits</p>
        </Link>
      </div>

      <div className="products-container">
        {products?.slice(0, 4).map((product) => (
          <Product
            key={product._id}
            product={product}
            onQuickView={handleQuickView}
          />
        ))}
      </div>
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={closeQuickView} />
      )}
      <TextVideoSection sectionData={textVideoSectionData} />

      {/* {aboutUsData && <AboutUs {...aboutUsData} />}
      <TextVideoSection1 sectionData={textVideoSectionData} /> */}
      <Advantages />

      <style jsx>{`
        .browse-all-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .browse-all-button {
          padding: 10px 20px;
          font-size: 1rem;
          color: #cb6ce6;
          background-color: transparent;
          border: 2px solid #cb6ce6;
          border-radius: 5px;
          cursor: pointer;
          transition:
            background-color 0.3s,
            color 0.3s;
          margin-bottom: 1rem;
        }

        .browse-all-button:hover {
          background-color: #cb6ce6;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
