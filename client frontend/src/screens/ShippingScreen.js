import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import Steps from "../components/Steps";
import { saveShippingAddress, savePaymentMethod } from "../Redux/Actions/cartActions";
import { formatPrice } from "../format";

export const PICKUP_ADDRESS = "Retiro en el local · Brasil #0196";

const ShippingScreen = ({ history }) => {
  const dispatch = useDispatch();
  const { shippingAddress = {}, cartItems } = useSelector((state) => state.cart);
  const wasPickup = !shippingAddress.address || shippingAddress.address === PICKUP_ADDRESS;

  const [mode, setMode] = useState(wasPickup ? "retiro" : "despacho");
  const [address, setAddress] = useState(wasPickup ? "" : shippingAddress.address);
  const [city, setCity] = useState(wasPickup ? "Linares" : shippingAddress.city || "Linares");
  const total = cartItems.reduce((a, i) => a + i.qty * i.price, 0);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress(mode === "retiro" ? { address: PICKUP_ADDRESS, city: "Linares" } : { address, city })
    );
    dispatch(savePaymentMethod("PayPal"));
    history.push("/placeorder");
  };

  return (
    <Layout title="Entrega">
      <div className="wrap" style={{ paddingTop: 32 }}>
        <Steps current={1} />
      </div>
      <form className="checkout wrap" onSubmit={submitHandler}>
        <div className="checkout-main">
          <h1 className="display display-lg">¿Cómo lo recibes?</h1>

          <fieldset className="card-x" style={{ border: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            <legend className="visually-hidden">Forma de entrega</legend>
            <label className={`choice ${mode === "retiro" ? "selected" : ""}`}>
              <input type="radio" name="entrega" checked={mode === "retiro"} onChange={() => setMode("retiro")} />
              <span>
                <strong>Retiro en el local</strong>
                <span>Brasil #0196, Linares · Sin costo</span>
              </span>
            </label>
            <label className={`choice ${mode === "despacho" ? "selected" : ""}`}>
              <input type="radio" name="entrega" checked={mode === "despacho"} onChange={() => setMode("despacho")} />
              <span>
                <strong>Despacho a domicilio</strong>
                <span>Indica la dirección de entrega</span>
              </span>
            </label>

            {mode === "despacho" && (
              <div className="form-grid" style={{ marginTop: 8 }}>
                <label className="field span-all">
                  Dirección
                  <input
                    className="input-x"
                    style={{ background: "#fff" }}
                    type="text"
                    required
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </label>
                <label className="field">
                  Ciudad
                  <input
                    className="input-x"
                    style={{ background: "#fff" }}
                    type="text"
                    required
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </label>
              </div>
            )}
          </fieldset>

          <div className="card-x">
            <h2 className="legend-x">Pago</h2>
            <p style={{ margin: 0, color: "var(--ink-2)" }}>
              Pagas con PayPal (cuenta o tarjeta) en el último paso, después de confirmar tu pedido.
            </p>
          </div>
        </div>

        <aside className="checkout-aside card-dark" aria-label="Resumen">
          <h2 className="display display-sm">Resumen</h2>
          <dl className="summary">
            <div>
              <dt>Productos</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>{mode === "retiro" ? "Retiro en el local" : "Despacho"}</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <button type="submit" className="btn-x lg btn-primary-x" disabled={cartItems.length === 0}>
            Revisar pedido
          </button>
        </aside>
      </form>
    </Layout>
  );
};

export default ShippingScreen;
