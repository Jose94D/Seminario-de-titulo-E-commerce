import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import TopTotal from "./TopTotal";
import LatestOrder from "./LatestOrder";

const Main = () => {
  const { loading, error, orders } = useSelector((state) => state.orderList);
  const { products } = useSelector((state) => state.productList);
  const lowStock = (products || []).filter((p) => p.countInStock <= 5).sort((a, b) => a.countInStock - b.countInStock);

  return (
    <section className="content-main">
      <div className="content-header">
        <h1 className="content-title">Resumen</h1>
        <Link to="/addproduct" className="btn btn-primary">
          + Añadir producto
        </Link>
      </div>

      <TopTotal orders={orders} products={products} />

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="card-title m-0">Últimos pedidos</h2>
            <Link to="/orders" className="fw-semibold">
              Ver todos
            </Link>
          </div>
          <LatestOrder orders={orders} loading={loading} error={error} />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="card-title m-0">Stock bajo</h2>
            <Link to="/products" className="fw-semibold">
              Ir a productos
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-muted m-0">Todos los productos tienen más de 5 unidades.</p>
          ) : (
            <div className="row g-3">
              {lowStock.map((p) => (
                <div className="col-md-6 col-xl-4" key={p._id}>
                  <Link
                    to={`/product/${p._id}/edit`}
                    className="d-flex justify-content-between align-items-center text-decoration-none box"
                    style={{ color: "var(--ink)" }}
                  >
                    <span className="fw-semibold">{p.name}</span>
                    <span className={`pill ${p.countInStock === 0 ? "pill-bad" : "pill-wait"}`}>
                      {p.countInStock === 0 ? "Agotado" : `${p.countInStock} unid.`}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Main;
