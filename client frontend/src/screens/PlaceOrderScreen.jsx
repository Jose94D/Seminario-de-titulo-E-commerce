import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import Steps from "../components/Steps";
import OrderLines from "../components/OrderLines";
import Message from "../components/LoadingError/Error";
import { createOrder, createReset } from "../store/ordersSlice";
import { formatPrice } from "../format";
import { PICKUP_ADDRESS } from "./ShippingScreen";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const { order, success, error, loading } = useSelector((state) => state.orders.create);

  const itemsPrice = Math.round(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  const address = cart.shippingAddress || {};
  const isPickup = address.address === PICKUP_ADDRESS;

  useEffect(() => {
    if (!address.address) navigate("/shipping", { replace: true });
  }, [address.address, navigate]);

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch(createReset());
    }
  }, [navigate, dispatch, success, order]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: address,
        paymentMethod: cart.paymentMethod || "PayPal",
        itemsPrice,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: itemsPrice,
      })
    );
  };

  return (
    <Layout title="Confirmar pedido">
      <div className="wrap" style={{ paddingTop: 32 }}>
        <Steps current={2} />
      </div>
      <section className="checkout wrap">
        <div className="checkout-main">
          <h1 className="display display-lg">Revisa tu pedido</h1>

          <div className="form-grid">
            <div className="card-x">
              <h2 className="legend-x">Cliente</h2>
              <div>{userInfo.name}</div>
              <div className="muted">{userInfo.email}</div>
            </div>
            <div className="card-x">
              <h2 className="legend-x">Entrega</h2>
              <div>{isPickup ? "Retiro en el local" : "Despacho a domicilio"}</div>
              <div className="muted">
                {isPickup ? "Brasil #0196, Linares" : `${address.address}, ${address.city}`}
              </div>
              <Link to="/shipping" style={{ fontSize: 14, fontWeight: 600 }}>
                Cambiar
              </Link>
            </div>
          </div>

          {cart.cartItems.length === 0 ? <Message>Tu carro está vacío.</Message> : <OrderLines items={cart.cartItems} />}
        </div>

        <aside className="checkout-aside card-dark" aria-label="Resumen">
          <h2 className="display display-sm">Tu pedido</h2>
          <dl className="summary">
            <div>
              <dt>Productos</dt>
              <dd>{formatPrice(itemsPrice)}</dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>{formatPrice(0)}</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatPrice(itemsPrice)}</dd>
            </div>
          </dl>
          {error && <Message variant="error">{error}</Message>}
          <button
            type="button"
            className="btn-x lg btn-primary-x"
            disabled={cart.cartItems.length === 0 || loading}
            onClick={placeOrderHandler}
          >
            {loading ? "Creando pedido…" : "Confirmar e ir a pagar"}
          </button>
          <Link to="/cart" style={{ textAlign: "center", fontSize: 14 }}>
            Volver al carro
          </Link>
        </aside>
      </section>
    </Layout>
  );
};

export default PlaceOrderScreen;
