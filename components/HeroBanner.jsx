import React from "react";
import Slider from "react-slick";
import { urlFor } from "../lib/client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroBanner = ({ heroBanner = {} }) => {
  const { images = [] } = heroBanner;

  // Responsive slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    fade: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    pauseOnHover: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false
        }
      }
    ],
    appendDots: dots => (
      <div className="absolute bottom-4 sm:bottom-8 w-full flex justify-center p-0 m-0 list-none">
        <ul className="flex space-x-1 sm:space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white bg-opacity-50 hover:bg-opacity-100 transition-all duration-300 cursor-pointer" />
    ),
    prevArrow: (
      <button 
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-2 sm:left-6 z-10 w-8 h-8 sm:w-12 sm:h-12 items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
      >
        <svg className="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    ),
    nextArrow: (
      <button 
        aria-label="Next slide"
        className="hidden sm:flex absolute right-2 sm:right-6 z-10 w-8 h-8 sm:w-12 sm:h-12 items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
      >
        <svg className="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  };

  return (
    <div className="relative w-full max-w-8xl mx-auto bg-transparent mt-6 md:mt-8 lg:mt-10">
      <div className="relative w-full overflow-hidden">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="relative w-full aspect-[16/9] sm:aspect-[3/1] lg:aspect-[21/9]">
              <img
                src={urlFor(image)}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover object-center bg-transparent"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HeroBanner;