import { configureStore } from "@reduxjs/toolkit";
import cart from "./cartSlice";
import user from "./userSlice";
import products from "./productsSlice";
import orders from "./ordersSlice";
import { save } from "./api";

const store = configureStore({
  reducer: { cart, user, products, orders },
});

// El carro y la sesión se guardan en el navegador para sobrevivir a una recarga
store.subscribe(() => {
  const { cart, user } = store.getState();
  save("cartItems", cart.cartItems);
  save("shippingAddress", cart.shippingAddress);
  save("paymentMethod", cart.paymentMethod);
  save("userInfo", user.userInfo);
});

export default store;
