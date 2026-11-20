import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer wrap">
      <span>Tuning Shop Linares · Brasil #0196, Linares · Proyecto de seminario de título</span>
      <nav aria-label="Información del local">
        <Link to="/horario">Horario</Link>
        <Link to="/ubicacion">Ubicación</Link>
        <Link to="/sobre_nosotros">Sobre nosotros</Link>
      </nav>
    </footer>
  );
};

export default Footer;
