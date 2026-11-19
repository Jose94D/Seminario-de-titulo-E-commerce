import React from "react";
import { Link } from "react-router-dom";

// base: la ruta del listado actual ("" para el catálogo completo, "/search/x", "/categoria/y")
const Pagination = ({ page, pages, base = "" }) =>
  pages > 1 ? (
    <nav className="pagination-x" aria-label="Páginas del catálogo">
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          className={x + 1 === page ? "active" : ""}
          aria-current={x + 1 === page ? "page" : undefined}
          to={`${base}/page/${x + 1}`}
        >
          {x + 1}
        </Link>
      ))}
    </nav>
  ) : null;

export default Pagination;
