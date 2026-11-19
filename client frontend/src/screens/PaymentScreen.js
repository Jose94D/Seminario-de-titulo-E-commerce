import React from "react";
import { Redirect } from "react-router-dom";

// El método de pago ahora se elige junto con la entrega.
const PaymentScreen = () => <Redirect to="/shipping" />;

export default PaymentScreen;
