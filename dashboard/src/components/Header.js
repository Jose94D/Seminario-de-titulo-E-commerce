import React from "react";

// Franja superior del contenido: enlace a la tienda pública.
const Header = () => (
  <header className="main-header">
    <a href={process.env.REACT_APP_STORE_URL || "http://localhost:3000"} target="_blank" rel="noreferrer">
      Ver la tienda ↗
    </a>
  </header>
);

export default Header;
