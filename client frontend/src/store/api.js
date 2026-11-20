import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Mensaje con que la API rechaza un token vencido o de un usuario eliminado
export const SESSION_EXPIRED = "Not authorized, token failed";

export const authHeaders = (getState) => ({
  headers: { Authorization: `Bearer ${getState().user.userInfo?.token}` },
});

// createAsyncThunk que entrega como error el mensaje de la API en vez del de axios
export const apiThunk = (type, request) =>
  createAsyncThunk(type, async (arg, { getState, rejectWithValue }) => {
    try {
      return await request(arg, getState);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  });

// Casos pending/fulfilled/rejected de un thunk sobre state[key] = { loading, error, ... }
export const trackRequest = (builder, thunk, key, onSuccess = () => ({})) =>
  builder
    .addCase(thunk.pending, (state) => {
      state[key] = { ...state[key], loading: true, error: null };
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state[key] = { ...state[key], loading: false, ...onSuccess(action.payload) };
    })
    .addCase(thunk.rejected, (state, action) => {
      state[key] = { ...state[key], loading: false, error: action.payload };
    });

// localStorage tolerante a datos corruptos
export const load = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const save = (key, value) => {
  if (value === undefined || value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(value));
};

export { axios };
