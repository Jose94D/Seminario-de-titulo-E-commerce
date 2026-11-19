import React from "react";

const STEPS = ["Carro", "Entrega", "Confirmar", "Pago"];

// current: índice (0-3) del paso en curso
const Steps = ({ current }) => (
  <ol className="steps" aria-label="Pasos de la compra">
    {STEPS.map((label, i) => (
      <li
        key={label}
        className={i < current ? "done" : i === current ? "current" : ""}
        aria-current={i === current ? "step" : undefined}
      >
        {i < current ? "✓" : i + 1} · {label}
      </li>
    ))}
  </ol>
);

export default Steps;
