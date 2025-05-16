import React from 'react';

const TopBanner = ({ text, discount, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="banner">
      <p className="text">{text}</p>
      <p>{discount}</p>
    </div>
  );
};

export default TopBanner;