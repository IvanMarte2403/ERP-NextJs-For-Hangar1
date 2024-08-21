"use client";  // Indica que este es un Client Component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import { auth, signInWithEmailAndPassword } from "../../lib/firebase";
  
export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Inicializa useRouter

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores anteriores

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user);
      router.push("/dashboard"); // Redirige a /home
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className="main-container">
      <div className="login-container">
        <div className="container-logo">
          <img
            className="container-img"
            src="img/logo-hangar-1.png"
          />
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="button-30" type="submit">Login</button>
        </form>
      </div>
    </main>
  );
}
