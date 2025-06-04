// CotizadorAvanzado/AfinacionBasica/ContainerCilindros.js
"use client";

export default function ContainerCilindros() {
  const cilindros = [3, 4, 5, 8, 6, 10];

  return (
    <div className="container-cilindros">
      <h4>Cilindros</h4>
      <div className="container-row-cilindros-select">
        {cilindros.map((num) => (
          <div key={num} className="cube-cilindros">
            <img
              src="CotizadorAvanzado/AfinacionBasica/cilindros.svg"
              alt=""
            />
            <p>{num}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
