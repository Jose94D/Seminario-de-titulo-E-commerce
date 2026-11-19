import React from "react";
import { CATEGORIES } from "../../format";

// Campos compartidos por los formularios de crear y editar producto.
// values: { name, category, price, countInStock, description, image }; set(campo, valor)
const ProductFields = ({ values, set }) => {
  const bind = (field) => ({ value: values[field], onChange: (e) => set(field, e.target.value) });

  return (
    <div className="row g-4">
      <div className="col-12">
        <label htmlFor="p-name" className="form-label">
          Nombre
        </label>
        <input id="p-name" type="text" className="form-control" required {...bind("name")} />
      </div>
      <div className="col-md-4">
        <label htmlFor="p-category" className="form-label">
          Categoría
        </label>
        <select id="p-category" className="form-select" required {...bind("category")}>
          <option value="" disabled>
            Elige una categoría…
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-4">
        <label htmlFor="p-price" className="form-label">
          Precio (CLP)
        </label>
        <input id="p-price" type="number" min="0" step="10" className="form-control" required {...bind("price")} />
      </div>
      <div className="col-md-4">
        <label htmlFor="p-stock" className="form-label">
          Stock
        </label>
        <input id="p-stock" type="number" min="0" className="form-control" required {...bind("countInStock")} />
      </div>
      <div className="col-12">
        <label htmlFor="p-description" className="form-label">
          Descripción
        </label>
        <textarea id="p-description" className="form-control" rows="5" required {...bind("description")} />
      </div>
      <div className="col-md-8">
        <label htmlFor="p-image" className="form-label">
          Imagen (URL)
        </label>
        <input
          id="p-image"
          type="text"
          className="form-control"
          placeholder="/images/productos/bateria-60ah.svg"
          required
          {...bind("image")}
        />
      </div>
      <div className="col-md-4">
        <span className="form-label d-block">Vista previa</span>
        <div className="box d-flex align-items-center justify-content-center" style={{ height: 120 }}>
          {values.image ? (
            <img src={values.image} alt="" style={{ maxHeight: 96, maxWidth: "100%" }} />
          ) : (
            <span className="text-muted" style={{ fontSize: 14 }}>
              Sin imagen
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFields;
