import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import ProductCard from "./ProductCard";

const renderCard = (product) =>
  render(
    <Provider store={createStore(() => ({}))}>
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    </Provider>
  );

const base = { _id: "abc", name: "Batería 12V 60Ah", image: "/x.svg", category: "baterias", price: 89990 };

test("muestra nombre, categoría, precio y enlace a la ficha", () => {
  renderCard({ ...base, countInStock: 5 });
  const link = screen.getByRole("link", { name: "Batería 12V 60Ah" });
  expect(link.getAttribute("href")).toBe("/products/abc");
  expect(screen.getByText("Baterías")).toBeTruthy();
  expect(screen.getByText(/89\.990/)).toBeTruthy();
  expect(screen.getByRole("button", { name: "Añadir" }).disabled).toBe(false);
});

test("sin stock indica Agotado y desactiva el botón", () => {
  renderCard({ ...base, countInStock: 0 });
  expect(screen.getByText(/Agotado/)).toBeTruthy();
  expect(screen.getByRole("button", { name: "Añadir" }).disabled).toBe(true);
});
