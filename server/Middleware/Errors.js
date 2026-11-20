const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Errores de datos enviados por el cliente: 400 en vez de 500.
const clientError = (err) => {
  if (err.name === "ValidationError") return Object.values(err.errors)[0].message;
  if (err.name === "CastError") return `Valor inválido para ${err.path}`;
  if (err.code === 11000) return `Ya existe un registro con ese ${Object.keys(err.keyValue || {})[0] || "valor"}`;
  return null;
};

const errorHandler = (err, req, res, next) => {
  const message = clientError(err);
  if (message) {
    err.message = message;
    res.status(400);
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
