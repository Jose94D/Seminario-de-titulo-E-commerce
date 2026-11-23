import seedUsers from "../data/users.js";

// DEMO_MODE=true: sitio público cuyas cuentas de prueba tienen contraseña conocida.
const HIDDEN = "Oculto en la demo";
// Mismo texto que PICKUP_ADDRESS en ShippingScreen.jsx de la tienda: no es un dato personal.
const PICKUP_ADDRESS = "Retiro en el local · Brasil #0196";

const isDemo = () => process.env.DEMO_MODE === "true";
const isSeedAccount = (user) => seedUsers.some((u) => u.email === user.email);

// El administrador de la demo solo puede leer.
export const isReadOnly = (req) =>
  isDemo() && req.user.isAdmin && !["GET", "HEAD"].includes(req.method);

// Nadie cambia la contraseña ni los datos de las cuentas compartidas.
export const protectSeedAccount = (req, res, next) => {
  if (isDemo() && isSeedAccount(req.user)) {
    res.status(403);
    throw new Error("Las cuentas de prueba no se pueden editar en la demo.");
  }
  next();
};

export const maskUser = (user) => {
  if (!isDemo() || isSeedAccount(user)) return user;
  const masked = { ...user, name: "Cliente" };
  for (const key of ["email", "telefono", "direccion", "rut"]) {
    if (key in masked) masked[key] = HIDDEN;
  }
  return masked;
};

// Solo el dueño con cuenta propia ve su pedido completo: las cuentas de prueba las usa cualquiera.
export const maskOrder = (order, viewer) => {
  if (!isDemo()) return order;
  const plain = order.toObject();
  const ownerId = plain.user?._id ?? plain.user;
  if (String(ownerId) === String(viewer._id) && !isSeedAccount(viewer)) return plain;

  if (plain.shippingAddress?.address !== PICKUP_ADDRESS) {
    plain.shippingAddress = { address: HIDDEN, city: HIDDEN };
  }
  if (plain.paymentResult?.email_address) plain.paymentResult.email_address = HIDDEN;
  if (plain.user?.name) plain.user = maskUser(plain.user);
  return plain;
};
