import React from "react";
import { Navigate } from "react-router";

// El método de pago ahora se elige junto con la entrega.
const PaymentScreen = () => <Navigate to="/shipping" replace />;

export default PaymentScreen;
