import reducer, { login, logout, getUserDetails } from "./userSlice";
import { SESSION_EXPIRED } from "./api";

const userInfo = { _id: "u1", name: "User", token: "abc" };

beforeEach(() => localStorage.clear());

test("el login correcto guarda la sesión", () => {
  const state = reducer(undefined, login.fulfilled(userInfo, "req", {}));
  expect(state.userInfo).toEqual(userInfo);
  expect(state.login.loading).toBe(false);
});

test("el login rechazado muestra el mensaje de la API", () => {
  const state = reducer(undefined, login.rejected(null, "req", {}, "Invalid Email or Password"));
  expect(state.userInfo).toBeNull();
  expect(state.login.error).toBe("Invalid Email or Password");
});

test("una petición rechazada por sesión vencida cierra la sesión", () => {
  const logged = reducer(undefined, login.fulfilled(userInfo, "req", {}));
  const state = reducer(logged, getUserDetails.rejected(null, "req", "profile", SESSION_EXPIRED));
  expect(state.userInfo).toBeNull();
});

test("logout limpia la sesión y el perfil", () => {
  const logged = reducer(undefined, login.fulfilled(userInfo, "req", {}));
  const state = reducer(logged, logout());
  expect(state.userInfo).toBeNull();
  expect(state.profile.user).toEqual({});
});
