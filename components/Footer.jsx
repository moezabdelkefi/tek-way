import React from "react";
import { AiFillInstagram, AiOutlineFacebook } from "react-icons/ai";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer-container">
      <hr className="footer-divider" />
      <div className="footer-content">
        <p className="phone-number">
          Phone: +216 96 666 326 || +216 95 073 350
        </p>

        <p className="icons">
          <a
            href="https://www.facebook.com/profile.php?id=61567119636913"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiOutlineFacebook />
          </a>
        </p>

        <p className="footer-copyright">
          {currentYear} Tek Way Tous Droits Réservés projet de{" "}
          <a href="https://www.badfi.tech" style={{ color: "purple" }}>
            BADFi.tech
          </a>
        </p>
      </div>

      <style jsx>{`
        .footer-container {
          padding: 10px 20px;
          text-align: center;
        }

        .footer-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .phone-number,
        .footer-copyright {
          font-size: 1rem;
          color: #cb6ce6;
        }

        .icons a {
          margin-left: 10px;
          font-size: 1.5rem;
          color: #000;
        }

        .footer-copyright {
          color: #555;
        }

        @media (max-width: 600px) {
          .footer-content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Footer;
