import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: [1, "La valoración va de 1 a 5"], max: [5, "La valoración va de 1 a 5"] },
    comment: { type: String, required: [true, "El comentario es obligatorio"] },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["baterias", "lubricantes", "accesorios"],
      default: "accesorios",
    },
    // Datos técnicos que la ficha muestra destacados, p. ej. { label: "Voltaje", value: "12V" }
    specs: [{ label: String, value: String }],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "El precio no puede ser negativo"],
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
      validate: { validator: Number.isInteger, message: "El stock debe ser un número entero" },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
