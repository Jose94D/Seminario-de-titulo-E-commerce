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

const PICKUP = "Retiro en el local · Brasil #0196";
const ana = { name: "Ana Pérez", email: "ana@example.org", password: "secreta123", telefono: "911111111", direccion: "Calle Privada 2", rut: "11.111.111-1" };

let mongo, admin, shared, own;
const api = request(app);
const auth = (token) => ({ Authorization: `Bearer ${token}` });
const login = async (email, password = "password") =>
  (await api.post("/api/users/login").send({ email, password })).body.token;

const order = async (token, address) => {
  const product = await Product.findOne({ countInStock: { $gte: 1 } });
  const res = await api.post("/api/orders").set(auth(token)).send({
    orderItems: [{ product: product._id, qty: 1 }],
    shippingAddress: { address, city: "Linares" },
  });
  assert.equal(res.status, 201);
  return res.body._id;
};

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
beforeEach(async () => {
  process.env.DEMO_MODE = "true";
  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);
  await User.insertMany(users);
  await Product.insertMany(products);
  own = (await api.post("/api/users").send(ana)).body.token;
  admin = await login("admin@example.com");
  shared = await login("user@example.com");
});

test("el administrador de la demo puede leer pero ninguna escritura pasa", async () => {
  const product = await Product.findOne();
  const id = await order(own, "Calle Privada 2");
  assert.equal((await api.get("/api/orders/all").set(auth(admin))).status, 200);

  const writes = [
    api.post("/api/products").send({ name: "X", description: "x", price: 1 }),
    api.put(`/api/products/${product._id}`).send({ price: 1 }),
    api.delete(`/api/products/${product._id}`),
    api.put(`/api/orders/${id}/delivered`),
    api.put(`/api/orders/${id}/pay`).send({}),
    api.put("/API/users/PROFILE").send({ password: "hackeada1" }),
  ];
  for (const write of writes) assert.equal((await write.set(auth(admin))).status, 403);

  assert.equal((await Product.findById(product._id)).price, product.price);
  assert.equal((await Order.findById(id)).isPaid, false);
});

test("la cuenta de cliente compartida compra, pero no cambia sus datos", async () => {
  assert.equal((await api.put("/API/users/PROFILE").set(auth(shared)).send({ password: "hackeada1" })).status, 403);
  await order(shared, PICKUP);
  assert.ok(await login("user@example.com"));
});

test("el panel no recibe datos personales de los clientes", async () => {
  const id = await order(own, "Calle Privada 2");
  for (const url of ["/api/users", "/api/orders/all", `/api/orders/${id}`]) {
    const res = await api.get(url).set(auth(admin));
    assert.equal(res.status, 200);
    for (const secret of [ana.name, ana.email, ana.telefono, ana.direccion, ana.rut]) {
      assert.ok(!res.text.includes(secret), `${url} expone ${secret}`);
    }
  }
});

test("la dirección escrita en la cuenta compartida no la ve el siguiente visitante", async () => {
  const id = await order(shared, "Calle Privada 9");
  const pickup = await order(shared, PICKUP);
  const responses = [
    await api.put(`/api/orders/${id}/pay`).set(auth(shared)).send({ email_address: "x@privado.cl" }),
    await api.get("/api/orders").set(auth(shared)),
    await api.get(`/api/orders/${id}`).set(auth(shared)),
  ];
  for (const res of responses) {
    assert.equal(res.status, 200);
    assert.ok(!/Calle Privada 9|x@privado\.cl/.test(res.text));
  }
  const pickupDetail = await api.get(`/api/orders/${pickup}`).set(auth(shared));
  assert.equal(pickupDetail.body.shippingAddress.address, PICKUP);
});

test("el dueño con cuenta propia ve su pedido completo y edita su perfil", async () => {
  const id = await order(own, "Calle Privada 2");
  const res = await api.get(`/api/orders/${id}`).set(auth(own));
  assert.equal(res.body.shippingAddress.address, "Calle Privada 2");
  assert.equal(res.body.user.email, ana.email);
  assert.equal((await api.put("/api/users/profile").set(auth(own)).send({ name: "Ana P." })).status, 200);
});

test("sin modo demo el administrador escribe y ve los datos, pero nunca los hashes", async () => {
  process.env.DEMO_MODE = "false";
  const product = await Product.findOne();
  assert.equal((await api.put(`/api/products/${product._id}`).set(auth(admin)).send({ price: 1 })).status, 200);
  const res = await api.get("/api/users").set(auth(admin));
  assert.ok(res.text.includes(ana.rut));
  assert.ok(res.body.every((user) => user.password === undefined));
});
