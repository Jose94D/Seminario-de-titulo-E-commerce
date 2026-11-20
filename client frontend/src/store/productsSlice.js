import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, authHeaders, axios, trackRequest } from "./api";

export const listProducts = apiThunk("products/list", async ({ keyword, pageNumber, category } = {}) => {
  const { data } = await axios.get("/api/products", { params: { keyword, pageNumber, category } });
  return data;
});

export const listProductDetails = apiThunk("products/detail", async (id) => {
  const { data } = await axios.get(`/api/products/${id}`);
  return data;
});

export const createProductReview = apiThunk("products/review", async ({ productId, review }, getState) => {
  await axios.post(`/api/products/${productId}/review`, review, authHeaders(getState));
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: { products: [] },
    detail: { product: { reviews: [] } },
    review: {},
  },
  reducers: {
    reviewReset: (state) => {
      state.review = {};
    },
  },
  extraReducers: (builder) => {
    trackRequest(builder, listProducts, "list", ({ products, page, pages }) => ({ products, page, pages }));
    trackRequest(builder, listProductDetails, "detail", (product) => ({ product }));
    trackRequest(builder, createProductReview, "review", () => ({ success: true }));
    // al buscar otra página no se muestran los productos de la anterior
    builder.addMatcher(listProducts.pending.match, (state) => {
      state.list.products = [];
    });
  },
});

export const { reviewReset } = productsSlice.actions;
export default productsSlice.reducer;
