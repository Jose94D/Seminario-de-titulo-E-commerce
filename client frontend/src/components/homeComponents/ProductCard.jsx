import React, { useState } from "react";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/Actions/cartActions";
import { formatPrice, categoryName } from "../../format";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const inStock = product.countInStock > 0;

  const add = async () => {
    await dispatch(addToCart(product._id, 1));
    setAdded(true);
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="media" tabIndex={-1} aria-hidden="true">
        <img src={product.image} alt="" loading="lazy" />
      </Link>
      <div>
        <Link to={`/products/${product._id}`} className="title">
          {product.name}
        </Link>
        <div className="meta">
          {categoryName(product.category)}
          {inStock ? "" : " · Agotado"}
        </div>
      </div>
      <div className="foot">
        <span className="price">{formatPrice(product.price)}</span>
        <button type="button" className="btn-x btn-outline-x" onClick={add} disabled={!inStock || added}>
          {added ? "Añadido ✓" : "Añadir"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
