import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

// Ruta de layout: muestra la ruta hija solo a administradores con sesión.
function PrivateRouter() {
  const { userInfo } = useSelector((state) => state.userLogin);
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRouter;
