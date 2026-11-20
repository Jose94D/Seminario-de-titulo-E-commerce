const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

// Precio en pesos chilenos: 89990 -> "$89.990"
export const formatPrice = (value) => clp.format(Number(value) || 0);

export const CATEGORIES = [
  { slug: "baterias", name: "Baterías" },
  { slug: "lubricantes", name: "Lubricantes" },
  { slug: "accesorios", name: "Accesorios" },
];

export const categoryName = (slug) => (CATEGORIES.find((c) => c.slug === slug) || {}).name || "Sin categoría";

const dateFormats = {};

// Fecha en español de Chile; las opciones son las de Intl.DateTimeFormat
export const formatDate = (value, options = { day: "numeric", month: "short", year: "numeric" }) => {
  const key = JSON.stringify(options);
  dateFormats[key] ||= new Intl.DateTimeFormat("es-CL", options);
  return dateFormats[key].format(new Date(value));
};
