import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const SobreNosotros = () => (
  <Layout title="Sobre nosotros">
    <section className="info-page wrap">
      <div>
        <p className="eyebrow">Sobre nosotros</p>
        <h1 className="display display-xl">Accesorios para tu auto, en Linares.</h1>
      </div>
      <div className="card-white" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <p className="lead" style={{ margin: 0 }}>
          Somos un negocio dedicado a la venta de artículos para automóvil: baterías, lubricantes, repuestos y accesorios.
        </p>
        <p className="lead" style={{ margin: 0 }}>
          El mejor lugar para arreglar tu auto con clase está en Linares.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
          <Link to="/page/1" className="btn-x lg btn-primary-x">
            Ver catálogo
          </Link>
          <Link to="/horario" className="btn-x lg btn-outline-x">
            Horario
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default SobreNosotros;
