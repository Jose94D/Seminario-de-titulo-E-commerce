import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../format";

// Lista de productos de un pedido (o del carro al confirmar).
const OrderLines = ({ items }) =>
  items.map((item) => (
    <article className="line-item" key={item.product}>
      <div className="thumb">
        <img src={item.image} alt="" />
      </div>
      <div>
        <Link to={`/products/${item.product}`} className="name">
          {item.name}
        </Link>
        <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>
          {item.qty} × {formatPrice(item.price)}
        </div>
      </div>
      <span className="price">{formatPrice(item.qty * item.price)}</span>
    </article>
  ));

export default OrderLines;
