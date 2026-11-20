import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

const { default: app } = await import("../app.js");
const { default: User } = await import("../Models/UserModel.js");
const { default: Product } = await import("../Models/ProductModel.js");
const { default: Order } = await import("../Models/OrderModel.js");
const { default: users } = await import("../data/users.js");
const { default: products } = await import("../data/Products.js");

let mongo;
const api = request(app);

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);
  await User.insertMany(users);
  await Product.insertMany(products);
});

const login = async (email) => {
  const res = await api.post("/api/users/login").send({ email, password: "password" });
  assert.equal(res.status, 200);
  return res.body.token;
};
const auth = (token) => ({ Authorization: `Bearer ${token}` });

const createOrder = async (token) => {
  const product = await Product.findOne();
  const res = await api
    .post("/api/orders")
    .set(auth(token))
    .send({
      orderItems: [{ name: product.name, qty: 1, image: product.image, price: product.price, product: product._id }],
      shippingAddress: { address: "Calle 1", city: "Linares", postalCode: "3580000", country: "Chile" },
      paymentMethod: "PayPal",
      itemsPrice: product.price,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: product.price,
    });
  assert.equal(res.status, 201);
  return res.body._id;
};

// --- Autenticación ---

test("login correcto devuelve token y no devuelve la contraseña", async () => {
  const res = await api.post("/api/users/login").send({ email: "user@example.com", password: "password" });
  assert.equal(res.status, 200);
  assert.ok(res.body.token);
  assert.equal(res.body.password, undefined);
});

test("login con contraseña incorrecta responde 401", async () => {
  const res = await api.post("/api/users/login").send({ email: "user@example.com", password: "otra" });
  assert.equal(res.status, 401);
});

test("registro crea el usuario y rechaza un email repetido", async () => {
  const nuevo = { name: "Ana", email: "ana@example.com", password: "secreta123", telefono: "911111111", direccion: "Calle 2", rut: "11.111.111-1" };
  const res = await api.post("/api/users").send(nuevo);
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  const stored = await User.findOne({ email: "ana@example.com" });
  assert.notEqual(stored.password, "secreta123"); // guardada con hash

  const repetido = await api.post("/api/users").send(nuevo);
  assert.equal(repetido.status, 400);
});

test("ruta privada sin token responde 401", async () => {
  const res = await api.get("/api/users/profile");
  assert.equal(res.status, 401);
});

test("token de un usuario eliminado responde 401, no 500", async () => {
  const token = await login("user@example.com");
  await User.deleteOne({ email: "user@example.com" });
  const res = await api.get("/api/users/profile").set(auth(token));
  assert.equal(res.status, 401);
});

test("actualizar el perfil sin cambiar la contraseña no impide volver a entrar", async () => {
  const token = await login("user@example.com");
  const res = await api.put("/api/users/profile").set(auth(token)).send({ name: "Usuario Nuevo" });
  assert.equal(res.status, 200);
  await login("user@example.com");
});

// --- Productos ---

test("listado filtra por categoría", async () => {
  const res = await api.get("/api/products?category=baterias");
  assert.equal(res.status, 200);
  assert.ok(res.body.products.length > 0);
  assert.ok(res.body.products.every((p) => p.category === "baterias"));
});

test("listado busca por nombre sin distinguir mayúsculas", async () => {
  const res = await api.get("/api/products?keyword=BATER");
  assert.ok(res.body.products.length > 0);
  assert.ok(res.body.products.every((p) => /bater/i.test(p.name)));
});

test("crear producto es solo para administradores", async () => {
  const userToken = await login("user@example.com");
  const adminToken = await login("admin@example.com");
  assert.equal((await api.post("/api/products").set(auth(userToken)).send({})).status, 401);

  const res = await api
    .post("/api/products")
    .set(auth(adminToken))
    .send({ name: "Filtro de aire", price: 12990, description: "Filtro", image: "/x.svg", countInStock: 5, category: "accesorios" });
  assert.equal(res.status, 201);
  assert.equal(res.body.category, "accesorios");
});

// --- Pedidos ---

test("un pedido lo ve su dueño y un admin, pero otro usuario recibe 404", async () => {
  const userToken = await login("user@example.com");
  const adminToken = await login("admin@example.com");
  const orderId = await createOrder(userToken);

  await api.post("/api/users").send({ name: "Otro", email: "otro@example.com", password: "password", telefono: "922222222", direccion: "Calle 3", rut: "22.222.222-2" });
  const otherToken = await login("otro@example.com");

  assert.equal((await api.get(`/api/orders/${orderId}`).set(auth(userToken))).status, 200);
  assert.equal((await api.get(`/api/orders/${orderId}`).set(auth(adminToken))).status, 200);
  assert.equal((await api.get(`/api/orders/${orderId}`).set(auth(otherToken))).status, 404);
  assert.equal((await api.put(`/api/orders/${orderId}/pay`).set(auth(otherToken)).send({})).status, 404);
});

test("marcar como entregado es solo para administradores", async () => {
  const userToken = await login("user@example.com");
  const adminToken = await login("admin@example.com");
  const orderId = await createOrder(userToken);

  assert.equal((await api.put(`/api/orders/${orderId}/delivered`).set(auth(userToken))).status, 401);
  const res = await api.put(`/api/orders/${orderId}/delivered`).set(auth(adminToken));
  assert.equal(res.status, 200);
  assert.equal(res.body.isDelivered, true);
});

test("pedido sin productos responde 400", async () => {
  const token = await login("user@example.com");
  const res = await api.post("/api/orders").set(auth(token)).send({ orderItems: [] });
  assert.equal(res.status, 400);
});
