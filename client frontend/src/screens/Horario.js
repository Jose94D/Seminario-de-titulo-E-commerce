import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const HORARIO = [
  ["Lunes", "10:00 – 18:00"],
  ["Martes", "10:00 – 18:00"],
  ["Miércoles", "10:00 – 18:00"],
  ["Jueves", "10:00 – 18:00"],
  ["Viernes", "10:00 – 18:00"],
  ["Sábado", "09:30 – 14:00"],
  ["Domingo", "Cerrado"],
];

const Horario = () => (
  <Layout title="Horario">
    <section className="info-page wrap">
      <div>
        <p className="eyebrow">El local</p>
        <h1 className="display display-xl">Horario de atención</h1>
        <p className="lead">Compra en línea a cualquier hora y retira tu pedido en el local dentro de este horario.</p>
        <Link to="/ubicacion" className="btn-x lg btn-outline-x" style={{ marginTop: 16 }}>
          Cómo llegar
        </Link>
      </div>
      <div className="card-white">
        <dl className="hours">
          {HORARIO.map(([dia, horas]) => (
            <div key={dia}>
              <dt>{dia}</dt>
              <dd className={horas === "Cerrado" ? "muted" : ""}>{horas}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  </Layout>
);

export default Horario;
