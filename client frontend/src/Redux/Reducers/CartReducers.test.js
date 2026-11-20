import { cartReducer } from "./CartReducers";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_CLEAR_ITEMS } from "../Constants/CartConstants";

const bateria = { product: "1", name: "Batería 12V 60Ah", price: 89990, qty: 1 };
const aceite = { product: "2", name: "Aceite 5W-30", price: 32990, qty: 2 };

test("añadir un producto nuevo lo agrega al carro", () => {
  const state = cartReducer(undefined, { type: CART_ADD_ITEM, payload: bateria });
  expect(state.cartItems).toEqual([bateria]);
});

test("añadir un producto que ya está reemplaza su cantidad, sin duplicarlo", () => {
  let state = cartReducer(undefined, { type: CART_ADD_ITEM, payload: bateria });
  state = cartReducer(state, { type: CART_ADD_ITEM, payload: { ...bateria, qty: 3 } });
  expect(state.cartItems).toHaveLength(1);
  expect(state.cartItems[0].qty).toBe(3);
});

test("quitar y vaciar el carro", () => {
  let state = { cartItems: [bateria, aceite], shippingAddress: {} };
  state = cartReducer(state, { type: CART_REMOVE_ITEM, payload: "1" });
  expect(state.cartItems).toEqual([aceite]);
  state = cartReducer(state, { type: CART_CLEAR_ITEMS });
  expect(state.cartItems).toEqual([]);
});
