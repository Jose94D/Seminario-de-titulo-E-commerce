import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, authHeaders, axios, trackRequest } from "./api";
import { logout } from "./userSlice";

export const createOrder = apiThunk("orders/create", async (order, getState) => {
  const { data } = await axios.post("/api/orders", order, authHeaders(getState));
  return data;
});

export const getOrderDetails = apiThunk("orders/detail", async (id, getState) => {
  const { data } = await axios.get(`/api/orders/${id}`, authHeaders(getState));
  return data;
});

export const payOrder = apiThunk("orders/pay", async ({ orderId, paymentResult }, getState) => {
  const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, authHeaders(getState));
  return data;
});

// Pago de demostración: marca el pedido como pagado sin pasar por PayPal
export const simulatePayment = (order) => payOrder({ orderId: order._id, paymentResult: {} });

export const listMyOrders = apiThunk("orders/mine", async (_, getState) => {
  const { data } = await axios.get("/api/orders", authHeaders(getState));
  return data;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    create: {},
    detail: { loading: true },
    pay: {},
    mine: { orders: [] },
  },
  reducers: {
    createReset: (state) => {
      state.create = {};
    },
    payReset: (state) => {
      state.pay = {};
    },
  },
  extraReducers: (builder) => {
    trackRequest(builder, createOrder, "create", (order) => ({ order, success: true }));
    trackRequest(builder, getOrderDetails, "detail", (order) => ({ order }));
    trackRequest(builder, payOrder, "pay", () => ({ success: true }));
    trackRequest(builder, listMyOrders, "mine", (orders) => ({ orders }));
    builder.addCase(logout, (state) => {
      state.mine = { orders: [] };
    });
  },
});

export const { createReset, payReset } = ordersSlice.actions;
export default ordersSlice.reducer;
