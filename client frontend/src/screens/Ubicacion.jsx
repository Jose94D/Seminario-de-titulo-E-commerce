import React from "react";
import Layout from "../components/Layout";

const Ubicacion = () => (
  <Layout title="Ubicación">
    <section className="info-page wrap">
      <div>
        <p className="eyebrow">El local</p>
        <h1 className="display display-xl">Dónde encontrarnos</h1>
        <p className="lead">Brasil #0196, Linares, Chile. Retira tus compras en el local dentro del horario de atención.</p>
        <a
          className="btn-x lg btn-dark-x"
          style={{ marginTop: 16 }}
          href="https://www.google.com/maps/search/?api=1&query=Brasil+0196+Linares+Chile"
          target="_blank"
          rel="noreferrer"
        >
          Abrir en Google Maps
        </a>
      </div>
      <div className="map-frame">
        {/* Mapa embebido de Google: no necesita API key */}
        <iframe
          title="Mapa del local en Brasil #0196, Linares"
          src="https://maps.google.com/maps?q=-35.85561846828572,-71.5939696916276&z=17&output=embed"
          style={{ border: 0, width: "100%", height: "420px", display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  </Layout>
);

export default Ubicacion;
