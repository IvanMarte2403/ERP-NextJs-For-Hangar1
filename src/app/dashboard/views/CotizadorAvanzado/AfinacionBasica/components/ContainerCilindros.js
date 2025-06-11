// CotizadorAvanzado/AfinacionBasica/components/ContainerCilindros.js
"use client";

import { useState, useEffect } from "react";

/**
 * Selector de cilindros.
 * Emite el número elegido mediante la prop onSelect.
 */
export default function ContainerCilindros({ onSelect }) {
  const cilindros = [3, 4, 5, 6, 8, 10];
  const [selected, setSelected] = useState(null);

  const handleClick = (num) => {
    setSelected(num);
    onSelect?.(num);
  };

  useEffect(() => {
    // Mantiene sincronizado el valor inicial si el padre lo rehidrata
    if (selected !== null) {
      onSelect?.(selected);
    }
  }, [selected, onSelect]);

  return (
    <div className="container-cilindros">
      <h4>Cilindros</h4>
      <div className="container-row-cilindros-select">
        {cilindros.map((num) => (
          <div
            key={num}
            role="button"
            tabIndex={0}
            aria-selected={selected === num}
            className={`cube-cilindros ${selected === num ? "selected" : ""}`}
            onClick={() => handleClick(num)}
            onKeyDown={(e) => e.key === "Enter" && handleClick(num)}
          >
            <img
              src="CotizadorAvanzado/AfinacionBasica/cilindros.svg"
              alt={`${num} cilindros`}
            />
            <p>{num}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
