import express from "express";
import asyncHandler from "express-async-handler";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { protect, admin } from "../Middleware/AuthMiddleware.js";
import { maskUser, protectSeedAccount } from "../Middleware/demo.js";
import generateToken from "../utils/generateToken.js";
import User from "./../Models/UserModel.js";

const userRouter = express.Router();

// Un objeto como { "$gt": "" } en email o password se colaría en la consulta a MongoDB.
const requireStrings = (res, ...values) => {
  if (values.some((v) => typeof v !== "string" || v.trim() === "")) {
    res.status(400);
    throw new Error("Email y contraseña son obligatorios");
  }
};

// 5 intentos fallidos por IP y email cada 15 minutos; los correctos no cuentan.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${String(req.body?.email).toLowerCase()}`,
  message: { message: "Demasiados intentos fallidos. Prueba de nuevo en 15 minutos." },
});

// LOGIN
userRouter.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    requireStrings(res, email, password);
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id) ,
        createdAt: user.createdAt,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  })
);

// REGISTER
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password, telefono, direccion, rut } = req.body;
    requireStrings(res, email, password);

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      telefono,
      direccion,
      rut
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        telefono: user.telefono,
        direccion: user.direccion,
        rut: user.rut,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  })
);

// PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        telefono: user.telefono,
        direccion: user.direccion,
        rut: user.rut,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  protect,
  protectSeedAccount,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.telefono = req.body.telefono || user.telefono;
      user.direccion = req.body.direccion || user.direccion;
      user.rut = req.body.rut || user.rut;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        telefono: user.telefono,
        direccion: user.direccion,
        rut: user.rut,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// GET ALL USER ADMIN
userRouter.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.json(users.map((user) => maskUser(user.toObject())));
  })
);

export default userRouter;