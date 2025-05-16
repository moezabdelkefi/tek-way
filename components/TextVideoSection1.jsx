import React, { useEffect, useState } from 'react';
import { client } from '../lib/client';
import { useRouter } from 'next/router';

const TextVideoSection1 = () => {
  const [sectionData, setSectionData] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    client
      .fetch(
        `*[_type == "textVideoSection2"]{
          title,
          text,
          "videoUrl": video.asset->url,
          product->{
            _id,
            slug
          }
        }`
      )
      .then((data) => {
        if (data && data.length > 0 && data[0].product) {
          setSectionData(data[0]);
          return client.fetch(`*[_type == "product" && _id == '${data[0].product._id}'][0]`);
        } else {
          throw new Error('No data found or product is null');
        }
      })
      .then((productData) => setProduct(productData))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!sectionData || !product) return <div>Chargement...</div>;

  const handleButtonClick = () => {
    router.push(`/product/${product.slug.current}`);
  };

  return (
    <div className="text-video-section">
      <div className="text">
        <h2>{sectionData.title}</h2>
        <p>{sectionData.text}</p>
        <button onClick={handleButtonClick}>Regarder De Plus Près</button>
      </div>
      <div className="video-container">
        <video 
          className="video-element" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={sectionData.videoUrl} type="video/mp4" />
          Votre Navigateur Ne Prend Pas En Charge La Balise Vidéo.
        </video>
      </div>

      <style jsx>{`
        .text-video-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }

        .video-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .video-element {
          max-width: 100%;
          max-height: 500px;
          width: auto;
          height: auto;
          border-radius: 8px;
          box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
        }

        .text {
          text-align: center;
          max-width: 800px;
        }

        h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 15px;
          color: #324d67;
        }

        p {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.6;
        }

        button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 1rem;
          color: #324d67;
          background-color: transparent;
          border: 2px solid #324d67;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
          margin-bottom: 1rem;
        }

        button:hover {
          background-color: #324d67;
          color: #fff;
        }

        @media (min-width: 768px) {
          .text-video-section {
            flex-direction: row;
            justify-content: space-between;
          }

          .text {
            text-align: left;
            max-width: 50%;
          }

          .video-container {
            max-width: 50%;
          }

          button {
            padding: 12px 24px;
            font-size: 1.1rem;
          }
        }

        @media (min-width: 1200px) {
          h2 {
            font-size: 3rem;
          }

          p {
            font-size: 1.4rem;
          }

          button {
            padding: 14px 28px;
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TextVideoSection1;