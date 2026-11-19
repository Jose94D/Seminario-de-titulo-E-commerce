import React from "react";
import ProductCard from "./ProductCard";
import Pagination from "./pagination";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

// Grilla de productos con su paginación; el listado lo carga la pantalla.
const ShopSection = ({ productList, base }) => {
  const { loading, error, products = [], page, pages } = productList;

  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;
  if (products.length === 0) return <Message>No encontramos productos. Prueba con otra búsqueda o categoría.</Message>;

  return (
    <>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <Pagination pages={pages} page={page} base={base} />
    </>
  );
};

export default ShopSection;
