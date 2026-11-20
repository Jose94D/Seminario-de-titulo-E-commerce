import React, { useEffect } from "react";
import "./admin.css";
import { BrowserRouter, Routes, Route } from "react-router";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/productScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import AddProduct from "./screens/AddProduct";
import Login from "./screens/LoginScreen";
import UsersScreen from "./screens/UsersScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import NotFound from "./screens/NotFound";
import PrivateRouter from "./PrivateRouter";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "./Redux/Actions/ProductActions";
import { listOrders } from "./Redux/Actions/OrderActions";

function App() {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listProducts());
      dispatch(listOrders());
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRouter />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/products" element={<ProductScreen />} />
            <Route path="/orders" element={<OrderScreen />} />
            <Route path="/order/:id" element={<OrderDetailScreen />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/users" element={<UsersScreen />} />
            <Route path="/product/:id/edit" element={<ProductEditScreen />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
