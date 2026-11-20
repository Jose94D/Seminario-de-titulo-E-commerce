import "dotenv/config";
import mongoose from "mongoose";
import { pathToFileURL } from "node:url";
import User from "./Models/UserModel.js";
import Product from "./Models/ProductModel.js";
import users from "./data/users.js";
import products from "./data/Products.js";

// Carga los usuarios y productos de ejemplo solo en colecciones vacías: nunca borra datos.
export const seedIfEmpty = async () => {
  const loaded = [];
  if ((await User.countDocuments()) === 0) {
    await User.insertMany(users);
    loaded.push(`${users.length} usuarios`);
  }
  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(products);
    loaded.push(`${products.length} productos`);
  }
  return loaded;
};

// npm run seed
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await mongoose.connect(process.env.MONGO_URL);
  const loaded = await seedIfEmpty();
  console.log(loaded.length ? `Datos de ejemplo cargados: ${loaded.join(" y ")}` : "La base ya tenía datos; no se cargó nada");
  await mongoose.disconnect();
}
