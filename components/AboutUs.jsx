import React from "react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../lib/client";

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

const AboutUs = ({ title, description, description1, image }) => {
  return (
    <section className="about-us">
      {image && (
        <img src={urlFor(image).url()} alt={title} className="about-image" />
      )}
      <div className="content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <style jsx>{`
        .about-us {
          display: flex;
          flex-direction: column;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin: 10px;
        }
        .about-image {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .about-us .content {
          max-width: 700px;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 20px;
        }
        .about-us h2 {
          margin: 0 0 10px;
          font-size: 3rem;
          color: #324d67;
        }
        .about-us .content p {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.6;
        }
        @media (min-width: 768px) {
          .about-us {
            flex-direction: row;
            align-items: center;
          }
          .about-image {
            width: 40%; /* Adjust image width */
            margin: 0 20px 0 0;
          }
          .about-us .content {
            flex: 1;
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
