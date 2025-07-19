// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ResetPassword from "./pages/ResetPassword";
import Configuracion from "./pages/Configuracion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  // 🔄 Estado para lista de usuarios
  const [listaDeUsuarios, setListaDeUsuarios] = useState([]);

  // 🔍 Estado para manejar el término de búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // 🔁 Función reutilizable para cargar usuarios desde el backend
  const cargarUsuarios = () => {
    fetch(`${BACKEND_URL}/usuarios`)
      .then((res) => res.json())
      .then((data) => {
        const usuariosConFechaFormateada = data.map((usuario) => ({
          ...usuario,
          fechaFormateada: new Date(usuario.fechaRegistro).toLocaleDateString(
            "es-MX",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
          ),
        }));
        console.log("✅ Usuarios con fecha formateada:", usuariosConFechaFormateada);
        setListaDeUsuarios(usuariosConFechaFormateada);
      })
      .catch((err) => console.error("❌ Error al cargar usuarios:", err));
  };

  // 🧠 Efecto para cargar usuarios al iniciar la app
  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* 🧭 Pasamos setTerminoBusqueda a Navbar para que actualice el estado global */}
        <Navbar setTerminoBusqueda={setTerminoBusqueda} />

        <div style={{ flex: 1 }}>
          <Routes>
            {/* 🏠 Pasamos el término de búsqueda a Home */}
            <Route
              path="/"
              element={
                <Home
                  usuarios={listaDeUsuarios}
                  onActualizar={cargarUsuarios}
                  terminoBusqueda={terminoBusqueda}
                />
              }
            />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/perfil/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/configuracion"
              element={<Configuracion onActualizar={cargarUsuarios} />}
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
