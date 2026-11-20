import store from "./index";

// Construir el store ejecuta todos los extraReducers: un caso duplicado falla aquí
test("el store se crea con los cuatro slices", () => {
  expect(Object.keys(store.getState())).toEqual(["cart", "user", "products", "orders"]);
  expect(store.getState().products.list.products).toEqual([]);
});
