import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
import Order from "./../Models/OrderModel.js";
import Product from "./../Models/ProductModel.js";

const orderRouter = express.Router();

// Un pedido solo lo ve o lo modifica su dueño o un administrador.
// order.user puede venir poblado (documento) o como ObjectId.
const isOwnerOrAdmin = (order, user) =>
  user.isAdmin || String(order.user._id ?? order.user) === String(user._id);

// CREATE ORDER
orderRouter.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    // Nombre, imagen y precio salen de la base: el navegador solo elige producto y cantidad.
    const products = await Product.find({ _id: { $in: orderItems.map((i) => i.product) } });
    const items = orderItems.map((i) => {
      const product = products.find((p) => String(p._id) === String(i.product));
      const qty = Number(i.qty);
      if (!product || !Number.isInteger(qty) || qty < 1 || qty > product.countInStock) {
        res.status(400);
        throw new Error(`Producto no disponible o cantidad inválida${product ? `: ${product.name}` : ""}`);
      }
      return { name: product.name, qty, image: product.image, price: product.price, product: product._id };
    });
    const itemsPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = new Order({
      orderItems: items,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: itemsPrice,
    });

    const createOrder = await order.save();
    res.status(201).json(createOrder);
  })
);

// ADMIN GET ALL ORDERS
orderRouter.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .populate("user", "id name email");
    res.json(orders);
  })
);
// USER LOGIN ORDERS
orderRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(order);
  })
);

// GET ORDER BY ID
orderRouter.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    // 404 también para pedidos ajenos, para no revelar que existen
    if (order && isOwnerOrAdmin(order, req.user)) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// ORDER IS PAID
orderRouter.put(
  "/:id/pay",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order && isOwnerOrAdmin(order, req.user)) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// ORDER IS DELIVERED
orderRouter.put(
  "/:id/delivered",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

export default orderRouter;
