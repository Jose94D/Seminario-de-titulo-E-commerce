import React, { useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import Steps from "../components/Steps";
import { addToCart, removeFromCart } from "../store/cartSlice";
import { formatPrice } from "../format";

const CartScreen = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productId = params.id;
  const qty = location.search ? Number(new URLSearchParams(location.search).get("qty")) || 1 : 1;

  const { cartItems } = useSelector((state) => state.cart);
  const count = cartItems.reduce((n, i) => n + Number(i.qty), 0);
  const total = cartItems.reduce((a, i) => a + i.qty * i.price, 0);

  useEffect(() => {
    if (productId) {
      dispatch(addToCart({ id: productId, qty }));
      navigate("/cart", { replace: true });
    }
  }, [dispatch, productId, qty, navigate]);

  return (
    <Layout title="Carro">
      <div className="wrap" style={{ paddingTop: 32 }}>
        <Steps current={0} />
      </div>
      <section className="checkout wrap">
        <div className="checkout-main">
          <h1 className="display display-lg">
            Tu carro{" "}
            <span className="muted" style={{ fontWeight: 600, fontSize: 26 }}>
              · {count === 1 ? "1 producto" : `${count} productos`}
            </span>
          </h1>

          {cartItems.length === 0 ? (
            <div className="card-x" style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 17 }}>Tu carro está vacío.</span>
              <Link to="/page/1" className="btn-x btn-primary-x">
                Ver catálogo
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <article className="line-item" key={item.product}>
                <div className="thumb">
                  <img src={item.image} alt="" />
                </div>
                <div>
                  <Link to={`/products/${item.product}`} className="name">
                    {item.name}
                  </Link>
                  <div className="controls">
                    <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      Cantidad
                      <select
                        value={item.qty}
                        onChange={(e) => dispatch(addToCart({ id: item.product, qty: Number(e.target.value) }))}
                      >
                        {[...Array(Math.max(1, Math.min(item.countInStock, 10))).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button type="button" className="btn-x btn-ghost-x" onClick={() => dispatch(removeFromCart(item.product))}>
                      Quitar
                    </button>
                  </div>
                </div>
                <span className="price">{formatPrice(item.qty * item.price)}</span>
              </article>
            ))
          )}

          <Link to="/page/1" style={{ fontWeight: 600 }}>
            ← Seguir comprando
          </Link>
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
              <dd>Se elige en el siguiente paso</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="btn-x lg btn-primary-x"
            disabled={cartItems.length === 0}
            onClick={() => navigate("/login?redirect=shipping")}
          >
            Continuar a la entrega
          </button>
          <p style={{ margin: 0, fontSize: 14, color: "var(--line)" }}>
            Pago seguro con PayPal. Puedes retirar en Brasil #0196, Linares.
          </p>
        </aside>
      </section>
    </Layout>
  );
};

export default CartScreen;
