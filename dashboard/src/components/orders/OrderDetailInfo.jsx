import React from "react";

const OrderDetailInfo = ({ order }) => (
  <div className="info-grid">
    <div>
      <h3>Cliente</h3>
      <div>{order.user.name}</div>
      <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
    </div>
    <div>
      <h3>Pago</h3>
      <div>{order.paymentMethod}</div>
      <span className={`pill mt-2 ${order.isPaid ? "pill-ok" : "pill-bad"}`}>{order.isPaid ? "Pagado" : "Pendiente"}</span>
    </div>
    <div>
      <h3>Entrega</h3>
      <div>{order.shippingAddress.address}</div>
      <div className="text-muted">{order.shippingAddress.city}</div>
    </div>
  </div>
);

export default OrderDetailInfo;
