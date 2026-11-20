import express from "express";
import cors from "cors";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";

// La app sin conexión a la base ni puerto, para poder probarla.
const app = express();
app.use(express.json());
app.use(cors());

// API
// Reemplaza usuarios y productos con los de ejemplo: solo fuera de producción.
if (process.env.NODE_ENV !== "production") {
  app.use("/api/import", ImportData);
}
app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

export default app;
