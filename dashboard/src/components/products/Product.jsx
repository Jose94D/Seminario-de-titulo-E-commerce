import React from "react";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../Redux/Actions/ProductActions";
import { formatPrice, categoryName } from "../../format";

const Product = ({ product }) => {
  const dispatch = useDispatch();

  const deleteHandler = () => {
    if (window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      dispatch(deleteProduct(product._id));
    }
  };

  return (
    <div className="col-sm-6 col-lg-4 col-xxl-3 mb-4">
      <article className="product-tile">
        <div className="media">
          <img src={product.image} alt="" />
        </div>
        <div>
          <div className="name">{product.name}</div>
          <div className="meta">
            {categoryName(product.category)} · {product.countInStock === 0 ? "Agotado" : `${product.countInStock} en stock`}
          </div>
        </div>
        <div className="price">{formatPrice(product.price)}</div>
        <div className="actions">
          <Link to={`/product/${product._id}/edit`} className="btn btn-sm btn-outline-success">
            Editar
          </Link>
          <button type="button" onClick={deleteHandler} className="btn btn-sm btn-outline-danger">
            Eliminar
          </button>
        </div>
      </article>
    </div>
  );
};

export default Product;
