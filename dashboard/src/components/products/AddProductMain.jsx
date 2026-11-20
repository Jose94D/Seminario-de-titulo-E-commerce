import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { PRODUCT_CREATE_RESET } from "../../Redux/Constants/ProductConstants";
import { createProduct } from "./../../Redux/Actions/ProductActions";
import Message from "../LoadingError/Error";
import ProductFields from "./ProductFields";

const EMPTY = { name: "", category: "", price: "", countInStock: "", description: "", image: "" };

const AddProductMain = () => {
  const [values, setValues] = useState(EMPTY);
  const [created, setCreated] = useState("");
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector((state) => state.productCreate);

  useEffect(() => {
    if (product) {
      setCreated(product.name);
      setValues(EMPTY);
      dispatch({ type: PRODUCT_CREATE_RESET });
    }
  }, [product, dispatch]);

  const set = (field, value) => setValues((v) => ({ ...v, [field]: value }));

  const submitHandler = (e) => {
    e.preventDefault();
    setCreated("");
    const { name, price, description, image, countInStock, category } = values;
    dispatch(createProduct(name, Number(price), description, image, Number(countInStock), category));
  };

  return (
    <section className="content-main" style={{ maxWidth: 1100 }}>
      <form onSubmit={submitHandler}>
        <div className="content-header">
          <div>
            <Link to="/products" className="fw-semibold">
              ← Productos
            </Link>
            <h1 className="content-title mt-2">Añadir producto</h1>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando…" : "Guardar producto"}
          </button>
        </div>
        <div className="card">
          <div className="card-body">
            {created && (
              <div className="mb-4">
                <Message variant="alert-success">“{created}” quedó publicado en la tienda.</Message>
              </div>
            )}
            {error && (
              <div className="mb-4">
                <Message variant="alert-danger">{error}</Message>
              </div>
            )}
            <ProductFields values={values} set={set} />
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddProductMain;
