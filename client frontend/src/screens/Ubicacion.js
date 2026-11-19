import React from "react";
import GoogleMaps from "simple-react-google-maps";
import Layout from "../components/Layout";

const MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

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
        {MAPS_KEY ? (
          <GoogleMaps
            apiKey={MAPS_KEY}
            style={{ height: "420px", width: "100%" }}
            zoom={17}
            center={{ lat: -35.85561846828572, lng: -71.5939696916276 }}
          />
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }} className="muted">
            El mapa necesita la clave REACT_APP_GOOGLE_MAPS_KEY en el archivo .env.
          </div>
        )}
      </div>
    </section>
  </Layout>
);

export default Ubicacion;
