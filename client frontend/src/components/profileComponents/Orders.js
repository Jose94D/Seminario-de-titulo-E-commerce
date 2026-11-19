import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/es";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { formatPrice } from "../../format";

const Orders = ({ loading, error, orders }) => {
  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!orders || orders.length === 0)
    return (
      <div className="card-x" style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <span>Todavía no tienes pedidos.</span>
        <Link to="/page/1" className="btn-x btn-primary-x">
          Empezar a comprar
        </Link>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {orders.map((order) => (
        <article className="order-row" key={order._id}>
          <div>
            <div className="when">
              Pedido #{order._id.slice(-6).toUpperCase()} · {moment(order.createdAt).locale("es").format("D MMM YYYY")}
            </div>
            <div style={{ marginTop: 8, fontWeight: 600, fontSize: 17 }}>
              {order.orderItems.map((i) => i.name).join(", ")}
            </div>
          </div>
          <div className="status-row">
            <span className={`pill ${order.isPaid ? "pill-ok" : "pill-bad"}`}>{order.isPaid ? "Pagado" : "Pago pendiente"}</span>
            <span className={`pill ${order.isDelivered ? "pill-ok" : "pill-wait"}`}>
              {order.isDelivered ? "Entregado" : "En preparación"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span className="price">{formatPrice(order.totalPrice)}</span>
            <Link to={`/order/${order._id}`} style={{ fontWeight: 600 }}>
              {order.isPaid ? "Ver detalle" : "Pagar"}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Orders;
