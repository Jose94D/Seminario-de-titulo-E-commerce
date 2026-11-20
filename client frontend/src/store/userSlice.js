import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, authHeaders, axios, load, SESSION_EXPIRED, trackRequest } from "./api";

export const login = apiThunk("user/login", async ({ email, password }) => {
  const { data } = await axios.post("/api/users/login", { email, password });
  return data;
});

export const register = apiThunk("user/register", async (newUser) => {
  const { data } = await axios.post("/api/users", newUser);
  return data;
});

export const getUserDetails = apiThunk("user/details", async (id, getState) => {
  const { data } = await axios.get(`/api/users/${id}`, authHeaders(getState));
  return data;
});

export const updateUserProfile = apiThunk("user/updateProfile", async (user, getState) => {
  const { data } = await axios.put("/api/users/profile", user, authHeaders(getState));
  return data;
});

const loggedOut = () => ({ userInfo: null, login: {}, register: {}, profile: { user: {} }, update: {} });

const userSlice = createSlice({
  name: "user",
  initialState: () => ({ ...loggedOut(), userInfo: load("userInfo", null) }),
  reducers: {
    logout: loggedOut,
  },
  extraReducers: (builder) => {
    trackRequest(builder, login, "login");
    trackRequest(builder, register, "register");
    trackRequest(builder, getUserDetails, "profile", (user) => ({ user }));
    trackRequest(builder, updateUserProfile, "update", () => ({ success: true }));
    builder
      // las tres respuestas traen la sesión (con token nuevo en el caso del perfil)
      .addMatcher(
        (action) => [login.fulfilled, register.fulfilled, updateUserProfile.fulfilled].some((t) => t.match(action)),
        (state, action) => {
          state.userInfo = action.payload;
        }
      )
      // cualquier petición rechazada por sesión vencida cierra la sesión
      .addMatcher(
        (action) => action.type.endsWith("/rejected") && action.payload === SESSION_EXPIRED,
        loggedOut
      );
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
