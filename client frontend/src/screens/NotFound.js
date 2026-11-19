import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const NotFound = () => (
  <Layout title="Página no encontrada">
    <section className="auth wrap">
      <div className="auth-card" style={{ textAlign: "center", alignItems: "center" }}>
        <p className="eyebrow" style={{ marginBottom: 0 }}>
          Error 404
        </p>
        <h1 className="display display-md">Esta página no existe</h1>
        <p className="muted" style={{ margin: 0 }}>
          Puede que el enlace esté mal escrito o que el producto ya no esté disponible.
        </p>
        <Link to="/" className="btn-x lg btn-dark-x">
          Volver al inicio
        </Link>
      </div>
    </section>
  </Layout>
);

export default NotFound;
