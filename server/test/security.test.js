import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";
delete process.env.CORS_ORIGINS; // usa los orígenes locales por defecto

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
const valid = { name: "Ana", email: "ana@example.com", password: "secreta123", telefono: "911111111", direccion: "Calle 2", rut: "11.111.111-1" };

// --- CORS ---

test("CORS permite la tienda y rechaza otros orígenes", async () => {
  const ok = await api.get("/api/products").set("Origin", "http://localhost:3000");
  assert.equal(ok.headers["access-control-allow-origin"], "http://localhost:3000");

  const otro = await api.get("/api/products").set("Origin", "https://sitio-ajeno.example");
  assert.equal(otro.headers["access-control-allow-origin"], undefined);
});

// --- Validación ---

test("registro con datos faltantes responde 400 con un mensaje claro", async () => {
  const { telefono, ...sinTelefono } = valid;
  const res = await api.post("/api/users").send(sinTelefono);
  assert.equal(res.status, 400);
  assert.equal(res.body.message, "El teléfono es obligatorio");
});

test("registro con email inválido o contraseña corta responde 400", async () => {
  assert.equal((await api.post("/api/users").send({ ...valid, email: "no-es-email" })).status, 400);
  assert.equal((await api.post("/api/users").send({ ...valid, password: "123" })).status, 400);
});

test("registro con un RUT repetido responde 400, no 500", async () => {
  const res = await api.post("/api/users").send({ ...valid, rut: users[0].rut });
  assert.equal(res.status, 400);
});

test("login con un operador de MongoDB en vez de texto responde 400", async () => {
  const res = await api.post("/api/users/login").send({ email: { $gt: "" }, password: "password" });
  assert.equal(res.status, 400);
  assert.equal(res.body.token, undefined);
});

test("un id con formato inválido responde 400, no 500", async () => {
  const res = await api.get("/api/products/no-es-un-id");
  assert.equal(res.status, 400);
});

test("producto con precio negativo responde 400", async () => {
  const token = await login("admin@example.com");
  const res = await api
    .post("/api/products")
    .set(auth(token))
    .send({ name: "Filtro", price: -100, description: "x", image: "/x.svg", countInStock: 1 });
  assert.equal(res.status, 400);
});

test("reseña con valoración fuera de 1 a 5 responde 400", async () => {
  const token = await login("user@example.com");
  const product = await Product.findOne();
  const res = await api.post(`/api/products/${product._id}/review`).set(auth(token)).send({ rating: 9, comment: "Bien" });
  assert.equal(res.status, 400);
});

// --- Pedidos: precios desde la base ---

const orderBody = (product, extra = {}) => ({
  orderItems: [{ name: "Cualquiera", qty: 2, image: "/x.svg", price: 1, product: product._id, ...extra }],
  shippingAddress: { address: "Calle 1", city: "Linares" },
  paymentMethod: "PayPal",
  totalPrice: 1,
});

test("el pedido usa el precio de la base, no el que envía el navegador", async () => {
  const token = await login("user@example.com");
  const product = await Product.findOne({ countInStock: { $gte: 2 } });
  const res = await api.post("/api/orders").set(auth(token)).send(orderBody(product));
  assert.equal(res.status, 201);
  assert.equal(res.body.orderItems[0].price, product.price);
  assert.equal(res.body.orderItems[0].name, product.name);
  assert.equal(res.body.totalPrice, product.price * 2);
});

test("pedir más unidades que el stock o una cantidad inválida responde 400", async () => {
  const token = await login("user@example.com");
  const product = await Product.findOne();
  const mucho = await api.post("/api/orders").set(auth(token)).send(orderBody(product, { qty: product.countInStock + 1 }));
  assert.equal(mucho.status, 400);
  const cero = await api.post("/api/orders").set(auth(token)).send(orderBody(product, { qty: 0 }));
  assert.equal(cero.status, 400);
});

// --- Límite de intentos ---

test("tras 5 intentos fallidos el login responde 429, incluso con la contraseña correcta", async () => {
  const email = "user@example.com";
  for (let i = 0; i < 5; i++) {
    const res = await api.post("/api/users/login").send({ email, password: "incorrecta" });
    assert.equal(res.status, 401);
  }
  const bloqueado = await api.post("/api/users/login").send({ email, password: "password" });
  assert.equal(bloqueado.status, 429);

  // otra cuenta desde la misma IP no queda bloqueada
  await login("admin@example.com");
});
