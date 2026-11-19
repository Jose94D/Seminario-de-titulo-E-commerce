import React from "react";
import { formatPrice } from "../../format";

const OrderDetailProducts = ({ order }) => {
  const itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <table className="table">
      <thead>
        <tr>
          <th style={{ width: "46%" }}>Producto</th>
          <th>Precio unitario</th>
          <th>Cantidad</th>
          <th className="text-end">Total</th>
        </tr>
      </thead>
      <tbody>
        {order.orderItems.map((item) => (
          <tr key={item.product}>
            <td>
              <div className="d-flex align-items-center gap-3">
                <span className="box d-inline-flex p-2">
                  <img src={item.image} alt="" style={{ width: 40, height: 40, objectFit: "contain" }} />
                </span>
                <span className="fw-semibold">{item.name}</span>
              </div>
            </td>
            <td>{formatPrice(item.price)}</td>
            <td>{item.qty}</td>
            <td className="text-end fw-semibold">{formatPrice(item.qty * item.price)}</td>
          </tr>
        ))}
        <tr>
          <td colSpan="4">
            <dl className="totals ms-auto" style={{ maxWidth: 320 }}>
              <div>
                <dt className="fw-normal text-muted">Productos</dt>
                <dd>{formatPrice(itemsPrice)}</dd>
              </div>
              <div>
                <dt className="fw-normal text-muted">Envío</dt>
                <dd>{formatPrice(order.shippingPrice)}</dd>
              </div>
              <div className="grand">
                <dt>Total</dt>
                <dd>{formatPrice(order.totalPrice)}</dd>
              </div>
            </dl>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OrderDetailProducts;
