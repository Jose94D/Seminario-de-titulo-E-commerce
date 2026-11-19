const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

// Precio en pesos chilenos: 89990 -> "$89.990"
export const formatPrice = (value) => clp.format(Number(value) || 0);

export const CATEGORIES = [
  { slug: "baterias", name: "Baterías" },
  { slug: "lubricantes", name: "Lubricantes" },
  { slug: "accesorios", name: "Accesorios" },
];

export const categoryName = (slug) => (CATEGORIES.find((c) => c.slug === slug) || {}).name || "Sin categoría";
