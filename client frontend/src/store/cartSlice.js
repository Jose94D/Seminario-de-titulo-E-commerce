import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axios, load } from "./api";
import { createOrder } from "./ordersSlice";

// Trae el producto para guardar en el carro su precio y stock actuales
export const addToCart = createAsyncThunk("cart/add", async ({ id, qty }) => {
  const { data } = await axios.get(`/api/products/${id}`);
  return {
    product: data._id,
    name: data.name,
    image: data.image,
    price: data.price,
    countInStock: data.countInStock,
    qty,
  };
});

const cartSlice = createSlice({
  name: "cart",
  initialState: () => ({
    cartItems: load("cartItems", []),
    shippingAddress: load("shippingAddress", {}),
    paymentMethod: load("paymentMethod", undefined),
  }),
  reducers: {
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // si el producto ya está, se reemplaza su cantidad en vez de duplicarlo
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const index = state.cartItems.findIndex((x) => x.product === item.product);
        if (index >= 0) state.cartItems[index] = item;
        else state.cartItems.push(item);
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.cartItems = [];
      });
  },
});

export const { removeFromCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions;
export default cartSlice.reducer;
