import express from "express";
import cors from "cors";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";

// La app sin conexión a la base ni puerto, para poder probarla.
const app = express();
// Detrás de un proxy (nginx, Render…), req.ip debe ser la del visitante y no la del proxy:
// de eso depende el límite de intentos del login.
if (process.env.TRUST_PROXY) app.set("trust proxy", Number(process.env.TRUST_PROXY));
app.use(express.json());
// Orígenes que pueden llamar a la API desde el navegador, separados por coma.
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:4000")
  .split(",")
  .map((o) => o.trim());
app.use(cors({ origin: allowedOrigins }));

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
