import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { urlFor } from "@/sanity/lib/image";
import styled from "styled-components";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
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
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  return (
    <Overlay isVisible={isVisible}>
      <Container ref={containerRef} isVisible={isVisible}>
        <CloseButton onClick={handleClose}>
          <AiOutlineClose />
        </CloseButton>
        <Content>
          <ImageSection>
            <BigImageContainer>
              <BigImage
                src={urlFor(product.image && product.image[index])}
                alt={product.name}
              />
            </BigImageContainer>
            <SmallImagesContainer>
              {product.image?.map((item, i) => (
                <SmallImage
                  key={i}
                  src={urlFor(item)}
                  className={i === index ? "selected" : ""}
                  onMouseEnter={() => setIndex(i)}
                />
              ))}
            </SmallImagesContainer>
          </ImageSection>
          <Details>
            <Title>{product.name}</Title>
            <Description>
              {truncateDescription(product.details, 35)}
            </Description>{" "}
            <hr />
            <Price>
              {product.discount ? (
                <>
                  <span
                    className="original-price"
                    style={{ textDecoration: "line-through" }}
                  >
                    {product.price}DT
                  </span>
                  <span className="discounted-price">
                    /
                    {(
                      product.price -
                      (product.price * product.discount) / 100
                    ).toFixed(2)}
                    DT
                  </span>
                </>
              ) : (
                `${product.price}DT`
              )}
            </Price>
            <div className="category">
              <p>{product.category}</p>
            </div>
            <div className="quantity">
              <p className="quantity-desc">
                <span className="minus" onClick={decQty}>
                  <AiOutlineMinus />
                </span>
                <span className="num">{qty}</span>
                <span className="plus" onClick={incQty}>
                  <AiOutlinePlus />
                </span>
              </p>
            </div>
            <div className="buttons">
              <button
                type="button"
                className="add-to-cart"
                onClick={() => onAdd(product, qty)}
              >
                Ajouter Au Panier
              </button>
            </div>
            <Features>
              {product.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </Features>
          </Details>
        </Content>
      </Container>
      <style jsx>{`
        .quantity {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-top: 10px;
        }
        .quantity-desc {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 5px;
          width: 100px; /* Adjust the width as needed */
        }
        .quantity-desc .minus,
        .quantity-desc .plus {
          cursor: pointer;
          padding: 0 10px;
        }
        .quantity-desc .num {
          padding: 0 10px;
          font-size: 1em;
        }
      `}</style>
    </Overlay>
  );
};

export default QuickView;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const Container = styled.div`
  background: white;
  padding: 20px 10px 10px 10px; /* Added top padding */
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  position: relative;
  max-height: 80%;
  overflow-y: auto;
  transform: ${({ isVisible }) => (isVisible ? "scale(1)" : "scale(0.9)")};
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    width: 90%;
    padding: 30px 20px 20px 20px; /* Adjusted top padding */
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 25px 20px 20px 20px; /* Adjusted top padding */
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 5px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    display: block;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BigImageContainer = styled.div`
  width: 100%;
  padding-top: 100%; /* Aspect ratio 4:3 */
  position: relative;

  @media (max-width: 480px) {
    padding-top: 100%;
  }
`;

const BigImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
`;

const SmallImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SmallImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.3s;
  border-radius: 10px;
  &.selected {
    border: 2px solid #000;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 5px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Price = styled.p`
  font-size: 18px;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Description = styled.p`
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Sizes = styled.div`
  margin-bottom: 10px;

  h4 {
    margin-bottom: 10px;

    @media (max-width: 480px) {
      font-size: 16px;
    }
  }
`;

const SizeList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 5px;
`;

const SizeItem = styled.li`
  cursor: pointer;
  padding: 3px 5px;
  border: 1px solid #000;
  border-radius: 5px;
  transition: background-color 0.3s;

  &.selected {
    background-color: #000;
    color: #fff;
  }

  @media (max-width: 480px) {
    padding: 2px 4px;
  }
`;

const Colors = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ColorLabel = styled.h4`
  margin-right: 10px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 5px;
`;

const ColorOption = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #000;
  cursor: pointer;

  @media (max-width: 480px) {
    width: 12px;
    height: 12px;
  }
`;

const Features = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;
