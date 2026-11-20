import React from "react";
import "./theme.css";
import { BrowserRouter, Routes, Route } from "react-router";
import HomeScreen from "./screens/HomeScreen";
import SingleProduct from "./screens/SingleProduct";
import Login from "./screens/Login";
import Register from "./screens/Register";
import CartScreen from "./screens/CartScreen";
import ShippingScreen from "./screens/ShippingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import NotFound from "./screens/NotFound";
import PrivateRouter from "./PrivateRouter";
import Horario from "./screens/Horario";
import Ubicacion from "./screens/Ubicacion";
import SobreNosotros from "./screens/SobreNosotros";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/search/:keyword" element={<HomeScreen />} />
        <Route path="/page/:pagenumber" element={<HomeScreen />} />
        <Route path="/search/:keyword/page/:pagenumber" element={<HomeScreen />} />
        <Route path="/categoria/:category" element={<HomeScreen />} />
        <Route path="/categoria/:category/page/:pagenumber" element={<HomeScreen />} />
        <Route path="/horario" element={<Horario />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/sobre_nosotros" element={<SobreNosotros />} />
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart/:id?" element={<CartScreen />} />
        <Route element={<PrivateRouter />}>
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
