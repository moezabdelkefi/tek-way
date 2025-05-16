import React from 'react';
import { AiFillGift } from 'react-icons/ai';
import { FaTruck, FaShieldAlt } from 'react-icons/fa';

const Advantages = () => {
  return (
    <section className="section">
      <h2 className="title">Pourquoi Choisir Art Gallérie ?</h2>
      <div className="card-container">
        <div className="card">
          <div className="icon-wrapper">
            <AiFillGift />
          </div>
          <div className="text-wrapper">
            <h3 className="subtitle">Énergie et Inspiration à Portée de Main</h3>
            <p className="description">Nos œuvres sont idéales pour tous types d'environnements maisons, bureaux, cafés, restaurants ou salles de jeux. Partout où vous avez besoin d'une touche créative, nos tableaux apportent énergie et inspiration.</p>
          </div>
        </div>
        <div className="card">
          <div className="icon-wrapper">
            <FaTruck />
          </div>
          <div className="text-wrapper">
            <h3 className="subtitle">Livraison Rapide et Fiable</h3>
            <p className="description">Nous offrons une livraison rapide et fiable de porte à porte, garantissant que vos tableaux préférés vous parviennent rapidement et sans tracas.</p>
          </div>
        </div>
        <div className="card">
          <div className="icon-wrapper">
            <FaShieldAlt />
          </div>
          <div className="text-wrapper">
            <h3 className="subtitle">Paiements Sécurisés et Retours Faciles</h3>
            <p className="description">Profitez de la tranquillité d'esprit grâce à nos options de paiement sécurisées et à notre politique de retour sans tracas. Si la coupe n'est pas parfaite, nous vous couvrons !</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
