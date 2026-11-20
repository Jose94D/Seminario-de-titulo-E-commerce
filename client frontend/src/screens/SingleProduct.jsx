import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import Rating from "../components/homeComponents/Rating";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import { createProductReview, listProductDetails } from "../Redux/Actions/ProductActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../Redux/Constants/ProductConstants";
import { formatPrice, categoryName, formatDate } from "../format";

const SingleProduct = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviewSent, setReviewSent] = useState(false);

  const productId = match.params.id;
  const dispatch = useDispatch();

  const { loading, error, product } = useSelector((state) => state.productDetails);
  const { userInfo } = useSelector((state) => state.userLogin);
  const {
    loading: loadingCreateReview,
    error: errorCreateReview,
    success: successCreateReview,
  } = useSelector((state) => state.productReviewCreate);

  useEffect(() => {
    if (successCreateReview) {
      setReviewSent(true);
      setRating("");
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(productId));
  }, [dispatch, productId, successCreateReview]);

  const addToCartHandler = () => history.push(`/cart/${productId}?qty=${qty}`);

  const submitHandler = (e) => {
    e.preventDefault();
    setReviewSent(false);
    dispatch(createProductReview(productId, { rating, comment }));
  };

  const ready = !loading && !error && product && product._id === productId;
  const inStock = ready && product.countInStock > 0;

  return (
    <Layout title={ready ? product.name : "Producto"}>
      <div className="wrap">
        {loading ? (
          <Loading />
        ) : error ? (
          <div style={{ paddingBlock: 48 }}>
            <Message variant="error">{error}</Message>
          </div>
        ) : ready ? (
          <>
            <nav className="breadcrumbs" aria-label="Ruta">
              <Link to="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              {product.category && (
                <>
                  <Link to={`/categoria/${product.category}`}>{categoryName(product.category)}</Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
              <span style={{ color: "var(--ink)" }}>{product.name}</span>
            </nav>

            <section className="product-layout">
              <div className="product-stage">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <div>
                  <p className="eyebrow">{categoryName(product.category)}</p>
                  <h1 className="display display-lg">{product.name}</h1>
                  <div style={{ marginTop: 16 }}>
                    <Rating
                      value={product.rating}
                      text={
                        product.numReviews === 1 ? "1 reseña" : `${product.numReviews} reseñas`
                      }
                    />
                  </div>
                </div>

                <div className="price-row">
                  <span className="price">{formatPrice(product.price)}</span>
                  {inStock ? (
                    <span className="stock-ok">En stock · {product.countInStock} unidades</span>
                  ) : (
                    <span className="stock-out">Agotado</span>
                  )}
                </div>

                <p className="lead" style={{ margin: 0 }}>
                  {product.description}
                </p>

                {product.specs && product.specs.length > 0 && (
                  <dl className="spec-grid">
                    {product.specs.map((s) => (
                      <div key={s.label}>
                        <dt>{s.label}</dt>
                        <dd>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {inStock && (
                  <div className="buy-row">
                    <label className="qty">
                      Cantidad
                      <select value={qty} onChange={(e) => setQty(e.target.value)}>
                        {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button type="button" className="btn-x lg btn-primary-x" style={{ flex: "1 1 240px" }} onClick={addToCartHandler}>
                      Añadir al carro
                    </button>
                  </div>
                )}

                <ul className="info-list">
                  <li>
                    <strong>Retiro en el local:</strong> Brasil #0196, Linares.
                  </li>
                  <li>
                    <strong>Pago:</strong> PayPal, con seguimiento del pedido en tu cuenta.
                  </li>
                </ul>
              </div>
            </section>

            <section className="reviews-layout" aria-labelledby="resenas">
              <div>
                <h2 id="resenas" className="display display-md" style={{ marginBottom: 24 }}>
                  Reseñas
                </h2>
                {product.reviews.length === 0 && <Message>Este producto aún no tiene reseñas.</Message>}
                {product.reviews.map((review) => (
                  <article key={review._id} className="review">
                    <header>
                      <strong style={{ color: "var(--ink)", fontSize: 16 }}>{review.name}</strong>
                      <span>{formatDate(review.createdAt, { dateStyle: "long" })}</span>
                    </header>
                    <div style={{ marginTop: 8 }}>
                      <Rating value={review.rating} />
                    </div>
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>

              <div className="card-white" style={{ alignSelf: "start" }}>
                <h3 className="display display-sm" style={{ marginBottom: 18 }}>
                  Escribe tu reseña
                </h3>
                {reviewSent && <Message variant="ok">¡Gracias! Tu reseña fue publicada.</Message>}
                {errorCreateReview && <Message variant="error">{errorCreateReview}</Message>}
                {userInfo ? (
                  <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 12 }}>
                    <label className="field">
                      Valoración
                      <select className="input-x" required value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value="">Elige una nota…</option>
                        <option value="5">5 · Excelente</option>
                        <option value="4">4 · Muy bueno</option>
                        <option value="3">3 · Bueno</option>
                        <option value="2">2 · Regular</option>
                        <option value="1">1 · Malo</option>
                      </select>
                    </label>
                    <label className="field">
                      Comentario
                      <textarea className="input-x" required value={comment} onChange={(e) => setComment(e.target.value)} />
                    </label>
                    <button type="submit" className="btn-x lg btn-dark-x" disabled={loadingCreateReview}>
                      {loadingCreateReview ? "Publicando…" : "Publicar reseña"}
                    </button>
                  </form>
                ) : (
                  <Message>
                    <Link to={`/login?redirect=products/${productId}`}>Inicia sesión</Link> para escribir una reseña.
                  </Message>
                )}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </Layout>
  );
};

export default SingleProduct;
