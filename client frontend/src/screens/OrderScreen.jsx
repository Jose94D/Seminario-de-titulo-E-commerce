import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Layout from "../components/Layout";
import Steps from "../components/Steps";
import OrderLines from "../components/OrderLines";
import Loading from "../components/LoadingError/Loading";
import Message from "../components/LoadingError/Error";
import { getOrderDetails, payOrder, simulacion } from "../Redux/Actions/OrderActions";
import { ORDER_PAY_RESET } from "../Redux/Constants/OrderConstants";
import { formatPrice, formatDate } from "../format";
import { PICKUP_ADDRESS } from "./ShippingScreen";

const fecha = (d) => formatDate(d, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

const OrderScreen = ({ match }) => {
  // null: cargando; "": la API no tiene PAYPAL_CLIENT_ID
  const [paypalClientId, setPaypalClientId] = useState(null);
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.orderDetails);
  const { loading: loadingPay, success: successPay } = useSelector((state) => state.orderPay);

  useEffect(() => {
    if (!order || order._id !== orderId || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, successPay, order]);

  const needsPaypal = order && order._id === orderId && !order.isPaid;
  useEffect(() => {
    if (needsPaypal && paypalClientId === null) {
      axios.get("/api/config/paypal").then(({ data }) => setPaypalClientId(data || ""));
    }
  }, [needsPaypal, paypalClientId]);

  const ready = !loading && !error && order && order._id === orderId;
  const itemsPrice = ready ? order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0) : 0;
  const isPickup = ready && order.shippingAddress.address === PICKUP_ADDRESS;

  return (
    <Layout title="Pedido">
      <div className="wrap" style={{ paddingTop: 32 }}>
        <Steps current={ready && order.isPaid ? 4 : 3} />
      </div>
      <div className="wrap">
        {loading ? (
          <Loading />
        ) : error ? (
          <div style={{ paddingBlock: 48 }}>
            <Message variant="error">{error}</Message>
          </div>
        ) : ready ? (
          <section className="checkout" style={{ paddingInline: 0 }}>
            <div className="checkout-main">
              {order.isPaid ? (
                <div className="card-x done-banner">
                  <span className="check" aria-hidden="true">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <div style={{ flex: "1 1 320px" }}>
                    <p className="eyebrow" style={{ marginBottom: 6 }}>
                      Pedido #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <h1 className="display display-md">¡Listo! Tu pedido está pagado.</h1>
                    <p className="muted" style={{ margin: "8px 0 0" }}>
                      {order.isDelivered
                        ? `Entregado el ${fecha(order.deliveredAt)}.`
                        : isPickup
                        ? "Te avisaremos cuando esté listo para retirar."
                        : "Te avisaremos cuando salga a despacho."}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="eyebrow">Pedido #{order._id.slice(-6).toUpperCase()}</p>
                  <h1 className="display display-lg">Paga tu pedido</h1>
                </div>
              )}

              <div className="form-grid">
                <div className="card-x">
                  <h2 className="legend-x">Cliente</h2>
                  <div>{order.user.name}</div>
                  <div className="muted">{order.user.email}</div>
                </div>
                <div className="card-x">
                  <h2 className="legend-x">Entrega</h2>
                  <div>{isPickup ? "Retiro en el local" : "Despacho a domicilio"}</div>
                  <div className="muted">
                    {isPickup ? "Brasil #0196, Linares" : `${order.shippingAddress.address}, ${order.shippingAddress.city}`}
                  </div>
                </div>
              </div>

              <div className="status-row">
                <span className={`pill ${order.isPaid ? "pill-ok" : "pill-bad"}`}>
                  {order.isPaid ? `Pagado · ${fecha(order.paidAt)}` : "Pago pendiente"}
                </span>
                <span className={`pill ${order.isDelivered ? "pill-ok" : "pill-wait"}`}>
                  {order.isDelivered ? `Entregado · ${fecha(order.deliveredAt)}` : "Entrega pendiente"}
                </span>
              </div>

              <OrderLines items={order.orderItems} />
            </div>

            <aside className="checkout-aside card-dark" aria-label="Resumen del pago">
              <h2 className="display display-sm">{order.isPaid ? "Resumen" : "Pago"}</h2>
              <dl className="summary">
                <div>
                  <dt>Productos</dt>
                  <dd>{formatPrice(itemsPrice)}</dd>
                </div>
                <div>
                  <dt>Entrega</dt>
                  <dd>{formatPrice(order.shippingPrice)}</dd>
                </div>
                <div className="total">
                  <dt>Total</dt>
                  <dd>{formatPrice(order.totalPrice)}</dd>
                </div>
              </dl>
              {order.isPaid ? (
                <Link to="/profile" className="btn-x lg btn-light-x">
                  Ver mis pedidos
                </Link>
              ) : (
                <>
                  {loadingPay && <Loading />}
                  <div className="paypal-box">
                    {paypalClientId === null ? (
                      <Loading />
                    ) : paypalClientId ? (
                      <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          createOrder={(data, actions) =>
                            actions.order.create({ purchase_units: [{ amount: { value: String(order.totalPrice) } }] })
                          }
                          onApprove={async (data, actions) => {
                            const details = await actions.order.capture();
                            dispatch(
                              payOrder(orderId, {
                                id: details.id,
                                status: details.status,
                                update_time: details.update_time,
                                email_address: details.payer?.email_address,
                              })
                            );
                          }}
                        />
                      </PayPalScriptProvider>
                    ) : (
                      <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                        PayPal no está configurado en esta demo. Usa «Simular pago».
                      </p>
                    )}
                  </div>
                  <button type="button" className="btn-x btn-on-dark-outline" onClick={() => dispatch(simulacion(order))}>
                    Simular pago (demo)
                  </button>
                </>
              )}
            </aside>
          </section>
        ) : null}
      </div>
    </Layout>
  );
};

export default OrderScreen;
