import React from "react";
import { Link } from "react-router";
import { formatPrice, formatDate } from "../../format";

const Orders = ({ orders }) => (
  <table className="table">
    <thead>
      <tr>
        <th scope="col">Pedido</th>
        <th scope="col">Cliente</th>
        <th scope="col">Fecha</th>
        <th scope="col">Total</th>
        <th scope="col">Pago</th>
        <th scope="col">Entrega</th>
        <th scope="col">
          <span className="sr-only">Acciones</span>
        </th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <tr key={order._id}>
          <td className="fw-semibold">#{order._id.slice(-6).toUpperCase()}</td>
          <td>
            {order.user ? order.user.name : "—"}
            <div className="text-muted" style={{ fontSize: 13 }}>
              {order.user ? order.user.email : ""}
            </div>
          </td>
          <td>{formatDate(order.createdAt)}</td>
          <td className="fw-semibold">{formatPrice(order.totalPrice)}</td>
          <td>
            <span className={`pill ${order.isPaid ? "pill-ok" : "pill-bad"}`}>{order.isPaid ? "Pagado" : "Pendiente"}</span>
          </td>
          <td>
            <span className={`pill ${order.isDelivered ? "pill-ok" : "pill-wait"}`}>
              {order.isDelivered ? "Entregado" : "Pendiente"}
            </span>
          </td>
          <td className="text-end">
            <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline-success">
              {order.isPaid && !order.isDelivered ? "Gestionar" : "Ver detalle"}
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Orders;
