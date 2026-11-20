import React from "react";
import { Navigate, Outlet } from "react-router";

// Ruta de layout: muestra la ruta hija si hay sesión; si no, manda al login.
function PrivateRouter() {
  const token = window.localStorage.getItem("userInfo");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRouter;
