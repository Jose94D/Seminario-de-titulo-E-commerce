import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const { seedIfEmpty } = await import("../seed.js");
const { default: User } = await import("../Models/UserModel.js");
const { default: Product } = await import("../Models/ProductModel.js");
const { default: products } = await import("../data/Products.js");

let mongo;
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test("el seed carga los datos de ejemplo una sola vez y no borra lo existente", async () => {
  assert.equal((await seedIfEmpty()).length, 2);
  await Product.create({ name: "Agregado por el admin", description: "x", price: 1000, countInStock: 1 });

  assert.deepEqual(await seedIfEmpty(), []); // segunda vez: no hace nada
  assert.equal(await Product.countDocuments(), products.length + 1);
  assert.equal(await User.countDocuments(), 2);
});
