import React from "react";
import { Link } from "react-router";
import Sidebar from "../components/sidebar";

const NotFound = () => (
  <>
    <Sidebar />
    <main className="main-wrap">
      <section className="content-main">
        <h1 className="content-title">Página no encontrada</h1>
        <p className="text-muted mt-3">Esta sección del panel no existe.</p>
        <Link to="/" className="btn btn-dark">
          Volver al resumen
        </Link>
      </section>
    </main>
  </>
);

export default NotFound;
