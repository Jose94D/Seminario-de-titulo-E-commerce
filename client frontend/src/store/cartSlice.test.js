import reducer, { addToCart, removeFromCart } from "./cartSlice";
import { createOrder } from "./ordersSlice";

const bateria = { product: "1", name: "Batería 12V 60Ah", price: 89990, qty: 1 };
const aceite = { product: "2", name: "Aceite 5W-30", price: 32990, qty: 2 };
const added = (item) => addToCart.fulfilled(item, "req", { id: item.product, qty: item.qty });

beforeEach(() => localStorage.clear());

test("añadir un producto nuevo lo agrega al carro", () => {
  const state = reducer(undefined, added(bateria));
  expect(state.cartItems).toEqual([bateria]);
});

test("añadir un producto que ya está reemplaza su cantidad, sin duplicarlo", () => {
  let state = reducer(undefined, added(bateria));
  state = reducer(state, added({ ...bateria, qty: 3 }));
  expect(state.cartItems).toHaveLength(1);
  expect(state.cartItems[0].qty).toBe(3);
});

test("quitar un producto", () => {
  let state = reducer(undefined, added(bateria));
  state = reducer(state, added(aceite));
  state = reducer(state, removeFromCart("1"));
  expect(state.cartItems).toEqual([aceite]);
});

test("crear el pedido vacía el carro", () => {
  let state = reducer(undefined, added(bateria));
  state = reducer(state, createOrder.fulfilled({ _id: "o1" }, "req", {}));
  expect(state.cartItems).toEqual([]);
});

test("el carro guardado en el navegador se carga al iniciar", () => {
  localStorage.setItem("cartItems", JSON.stringify([aceite]));
  expect(reducer(undefined, { type: "@@init" }).cartItems).toEqual([aceite]);
});
