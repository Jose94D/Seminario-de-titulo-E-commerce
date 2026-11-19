import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

// Estructura común de todas las páginas de la tienda.
const Layout = ({ children, title }) => {
  useEffect(() => {
    document.title = title ? `${title} · Tuning Shop Linares` : "Tuning Shop Linares";
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="page">
      <Header />
      <main className="page-main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
