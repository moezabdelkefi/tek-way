import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { useRouter } from 'next/router';

const TextVideoSection = () => {
  const [sectionData, setSectionData] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await client.fetch(
          `*[_type == "textVideoSection"]{
            title,
            text,
            "videoUrl": video.asset->url,
            product->{
              _id,
              slug
            }
          }`
        );
        
        if (!data || data.length === 0) {
          throw new Error('No section data found');
        }
        
        setSectionData(data[0]);
        
        const productData = await client.fetch(
          `*[_type == "product" && _id == '${data[0].product._id}'][0]`
        );
        
        if (!productData) {
          throw new Error('Product not found');
        }
        
        setProduct(productData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = () => {
    router.push(`/product/${product.slug.current}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4 bg-red-50 text-red-600 rounded-lg max-w-4xl mx-auto">
        <p>Error loading content: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!sectionData || !product) {
    return null; // or a more specific fallback
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row items-center gap-10 xl:gap-16">
        {/* Text Content */}
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
            {sectionData.title}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {sectionData.text}
          </p>
          
          <button
            onClick={handleButtonClick}
            className="px-8 py-3 md:px-10 md:py-4 text-lg font-medium rounded-lg border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-200"
          >
            Regarder De Plus Près
          </button>
        </div>

        {/* Video Container */}
        <div className="lg:w-1/2 w-full flex justify-center">
          <div className="relative w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-xl">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={sectionData.videoUrl} type="video/mp4" />
              Votre navigateur ne prend pas en charge la balise vidéo.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-black/5 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextVideoSection;