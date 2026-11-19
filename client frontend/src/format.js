const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

// Precio en pesos chilenos: 89990 -> "$89.990"
export const formatPrice = (value) => clp.format(Number(value) || 0);

export const CATEGORIES = [
  { slug: "baterias", name: "Baterías", desc: "Para autos, camionetas y motos" },
  { slug: "lubricantes", name: "Lubricantes", desc: "Aceites, refrigerante y frenos" },
  { slug: "accesorios", name: "Accesorios", desc: "Luces, volantes, alfombras y más" },
];

export const categoryName = (slug) => (CATEGORIES.find((c) => c.slug === slug) || {}).name || "";
