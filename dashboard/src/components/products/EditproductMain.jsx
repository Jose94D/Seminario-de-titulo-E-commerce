import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editProduct, updateProduct } from "./../../Redux/Actions/ProductActions";
import { PRODUCT_UPDATE_RESET } from "../../Redux/Constants/ProductConstants";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import ProductFields from "./ProductFields";

const EditProductMain = ({ productId }) => {
  const [values, setValues] = useState(null);
  const [saved, setSaved] = useState(false);
  const dispatch = useDispatch();

  const { loading, error, product } = useSelector((state) => state.productEdit);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector(
    (state) => state.productUpdate
  );

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      setSaved(true);
    } else if (!product.name || product._id !== productId) {
      dispatch(editProduct(productId));
    } else {
      setValues({
        name: product.name,
        category: product.category || "",
        price: product.price,
        countInStock: product.countInStock,
        description: product.description,
        image: product.image,
      });
    }
  }, [product, dispatch, productId, successUpdate]);

  const set = (field, value) => {
    setSaved(false);
    setValues((v) => ({ ...v, [field]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        ...values,
        price: Number(values.price),
        countInStock: Number(values.countInStock),
      })
    );
  };

  return (
    <section className="content-main" style={{ maxWidth: 1100 }}>
      <form onSubmit={submitHandler}>
        <div className="content-header">
          <div>
            <Link to="/products" className="fw-semibold">
              ← Productos
            </Link>
            <h1 className="content-title mt-2">Editar producto</h1>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loadingUpdate || !values}>
            {loadingUpdate ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
        <div className="card">
          <div className="card-body">
            {saved && (
              <div className="mb-4">
                <Message variant="alert-success">Cambios guardados.</Message>
              </div>
            )}
            {errorUpdate && (
              <div className="mb-4">
                <Message variant="alert-danger">{errorUpdate}</Message>
              </div>
            )}
            {loading || !values ? (
              error ? <Message variant="alert-danger">{error}</Message> : <Loading />
            ) : (
              <ProductFields values={values} set={set} />
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default EditProductMain;
