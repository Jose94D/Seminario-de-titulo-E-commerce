import { formatPrice, categoryName, formatDate } from "./format";

// Intl puede separar el signo con un espacio duro según la versión de ICU.
const normalize = (s) => s.replace(/\s/g, "");

test("formatPrice usa pesos chilenos sin decimales", () => {
  expect(normalize(formatPrice(89990))).toBe("$89.990");
  expect(normalize(formatPrice(1234567))).toBe("$1.234.567");
});

test("formatPrice tolera valores vacíos o inválidos", () => {
  expect(normalize(formatPrice(undefined))).toBe("$0");
  expect(normalize(formatPrice("abc"))).toBe("$0");
});

test("categoryName traduce el slug y devuelve vacío si no existe", () => {
  expect(categoryName("baterias")).toBe("Baterías");
  expect(categoryName("otra")).toBe("");
});

test("formatDate muestra la fecha en español", () => {
  const fecha = new Date(2026, 10, 19, 21, 31);
  expect(formatDate(fecha)).toMatch(/19 nov/);
  expect(formatDate(fecha, { dateStyle: "long" })).toBe("19 de noviembre de 2026");
});
