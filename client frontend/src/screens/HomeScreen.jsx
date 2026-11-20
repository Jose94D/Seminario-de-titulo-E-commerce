import React, { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import ShopSection from "../components/homeComponents/ShopSection";
import { listProduct } from "../Redux/Actions/ProductActions";
import { addToCart } from "../Redux/Actions/cartActions";
import { CATEGORIES, categoryName, formatPrice } from "../format";

const tileClass = ["tile-dark", "tile-green", "tile-light"];

const Arrow = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Featured = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const spec = (product.specs || []).map((s) => s.value).join(" · ");

  return (
    <div className="showcase">
      <div className="showcase-top">
        <span>DESTACADO</span>
        <span>{categoryName(product.category).toUpperCase()}</span>
      </div>
      <img className="showcase-img" src={product.image} alt="" />
      <div className="showcase-card">
        <div>
          <Link to={`/products/${product._id}`} className="name">
            {product.name}
          </Link>
          <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>
            {spec}
            {product.countInStock > 0 ? " · En stock" : " · Agotado"}
          </div>
        </div>
        <div className="buy">
          <span className="price">{formatPrice(product.price)}</span>
          <button
            type="button"
            className="btn-x btn-dark-x"
            disabled={product.countInStock === 0 || added}
            onClick={async () => {
              await dispatch(addToCart(product._id, 1));
              setAdded(true);
            }}
          >
            {added ? "Añadido ✓" : "Añadir al carro"}
          </button>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = () => {
  const params = useParams();
  const { keyword, pagenumber, category } = params;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const isLanding = !keyword && !category && !pagenumber;

  useEffect(() => {
    dispatch(listProduct(keyword, pagenumber, category));
  }, [dispatch, keyword, pagenumber, category]);

  const products = productList.products || [];
  const featured =
    products.find((p) => p.category === "baterias" && p.countInStock > 0) || products.find((p) => p.countInStock > 0);

  if (!isLanding) {
    const title = keyword ? `Resultados para “${keyword}”` : category ? categoryName(category) : "Catálogo";
    const base = keyword ? `/search/${keyword}` : category ? `/categoria/${category}` : "";
    return (
      <Layout title={title}>
        <section className="wrap" style={{ paddingTop: 48, paddingBottom: 88 }}>
          <p className="eyebrow">{keyword ? "Búsqueda" : "Catálogo"}</p>
          <h1 className="display display-lg" style={{ marginBottom: 28 }}>
            {title}
          </h1>
          <nav className="filters" aria-label="Filtrar por categoría" style={{ marginBottom: 32 }}>
            <NavLink to="/page/1" className={() => (!category && !keyword ? "active" : "")}>
              Todo
            </NavLink>
            {CATEGORIES.map((c) => (
              <NavLink key={c.slug} to={`/categoria/${c.slug}`}>
                {c.name}
              </NavLink>
            ))}
          </nav>
          <ShopSection productList={productList} base={base} />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="hero wrap">
        <div>
          <p className="eyebrow">Accesorios y mantención · Linares</p>
          <h1 className="display display-xl">Lo que tu auto necesita, elegido con criterio.</h1>
          <p className="lead">
            Baterías, lubricantes y accesorios seleccionados uno por uno. Compra en línea y retira en el local.
          </p>
          <div className="actions">
            <Link to="/page/1" className="btn-x lg btn-primary-x">
              Ver catálogo
            </Link>
            <a href="#categorias" className="btn-x lg btn-outline-x">
              Buscar por categoría
            </a>
          </div>
        </div>
        {featured && <Featured product={featured} />}
      </section>

      <section id="categorias" className="wrap section" aria-label="Categorías">
        <div className="categories">
          {CATEGORIES.map((c, i) => (
            <Link key={c.slug} to={`/categoria/${c.slug}`} className={`category-tile ${tileClass[i]}`}>
              <span>
                <span className="num">0{i + 1}</span>
                <span className="name">{c.name}</span>
                <span className="desc">{c.desc}</span>
              </span>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2 className="display display-md">Recién llegados</h2>
          <Link to="/page/1" style={{ fontWeight: 600 }}>
            Ver todo el catálogo
          </Link>
        </div>
        <ShopSection productList={{ ...productList, products: products.slice(0, 8), pages: 1 }} />
      </section>

      <section className="wrap section">
        <div className="card-dark pickup">
          <div>
            <h2 className="display display-md">Retira en el local</h2>
            <p style={{ margin: "10px 0 0", color: "var(--line)", fontSize: 17 }}>
              Brasil #0196, Linares. Compra en línea y pasa a buscarlo.
            </p>
          </div>
          <div className="actions">
            <Link to="/ubicacion" className="btn-x btn-light-x">
              Cómo llegar
            </Link>
            <Link to="/horario" className="btn-x btn-on-dark-outline">
              Ver horario
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomeScreen;
