import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email no es válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      // se valida antes del hook que la cifra
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
    },
    direccion: {
      type: String,
      required: [true, "La dirección es obligatoria"],
    },
    rut: {
      type: String,
      required: [true, "El RUT es obligatorio"],
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

// Login
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Register
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // sin el return se volvía a cifrar el hash
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;