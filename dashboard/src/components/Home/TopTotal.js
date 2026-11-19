import React from "react";
import { formatPrice } from "../../format";

const TopTotal = ({ orders = [], products = [] }) => {
  const paid = orders.filter((o) => o.isPaid);
  const income = paid.reduce((sum, o) => sum + o.totalPrice, 0);
  const toDeliver = paid.filter((o) => !o.isDelivered).length;
  const outOfStock = products.filter((p) => p.countInStock === 0).length;

  const stats = [
    ["Ingresos", formatPrice(income)],
    ["Pedidos", orders.length],
    ["Por entregar", toDeliver, true],
    ["Sin stock", outOfStock],
  ];

  return (
    <div className="stat-grid">
      {stats.map(([label, value, accent]) => (
        <div className="stat" key={label}>
          <div className="stat-label">{label}</div>
          <div className={`stat-value ${accent ? "accent" : ""}`}>{value}</div>
        </div>
      ))}
    </div>
  );
};

export default TopTotal;
