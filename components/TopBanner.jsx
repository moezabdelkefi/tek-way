import React from "react";

const TopBanner = ({ text, discount, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="banner text-1xl md:text-2xl lg:text-1xl bg-gradient-to-r from-purple-500 to-pink-600">
      <p className="text">{text}</p>
      <p>{discount}</p>
    </div>
  );
};

export default TopBanner;
