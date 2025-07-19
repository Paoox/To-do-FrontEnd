// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import TablaUsuarios from "../components/TablaUsuarios";
import PostCard from "../components/PostCard";
import { Box, Typography, Divider } from "@mui/material";

function Home({ usuarios, onActualizar, terminoBusqueda = "" }) {
  const [posts, setPosts] = useState([]);

  // 🔁 Cargar todos los posts del sistema al inicio
  const fetchTodosLosPosts = async () => {
    try {
      const response = await fetch("http://localhost:8080/publicaciones");
      const data = await response.json();

      if (Array.isArray(data)) {
        // Mezclar aleatoriamente los posts
        const aleatorios = [...data].sort(() => Math.random() - 0.5);
        setPosts(aleatorios);
      } else {
        console.error("❌ El backend no devolvió un arreglo:", data);
      }
    } catch (error) {
      console.error("❌ Error al obtener posts:", error);
    }
  };

  useEffect(() => {
    fetchTodosLosPosts();
  }, []);

  // ✅ Cuando un post se actualiza (likes o reacciones)
  const handlePostActualizado = (postActualizado) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postActualizado.id ? postActualizado : post
      )
    );
  };

  // 🔍 Filtrar posts por contenido (ignorando mayúsculas)
  const postsFiltrados = posts.filter((post) =>
    post.contenido.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      {/* 🧑‍💻 Tabla de usuarios */}
      <Typography
        variant="h6"
        sx={{
          padding: "0 1rem",
          margin: 0,
          fontStyle: "italic",
          fontWeight: "bold",
        }}
      >
        Conoce a nuestros usuarios más destacados
      </Typography>

      <TablaUsuarios usuarios={usuarios} />

      <Divider sx={{ my: 4 }} />

      {/* 📰 Sección de posts */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Lo más viral
      </Typography>

      <Box>
        {postsFiltrados.length === 0 ? (
          <Typography variant="body1">
            {terminoBusqueda
              ? "No se encontraron publicaciones que coincidan con tu búsqueda."
              : "Cargando publicaciones..."}
          </Typography>
        ) : (
          postsFiltrados.map((post) => {
            const avatarCompleto = post.usuario.avatarUrl?.startsWith(
              "/uploads/"
            )
              ? `http://localhost:8080${post.usuario.avatarUrl}`
              : post.usuario.avatarUrl;

            const imagenCompleta = post.imagenUrl?.startsWith("/uploads/")
              ? `http://localhost:8080${post.imagenUrl}`
              : post.imagenUrl;

            return (
              <PostCard
                key={post.id}
                id={post.id}
                usuarioId={post.usuario.id}
                nombre={post.usuario.nombre}
                nickname={post.usuario.nickname}
                avatarUrl={avatarCompleto}
                contenido={post.contenido}
                imagenUrl={imagenCompleta}
                fecha={post.fechaCreacion}
                likes={post.likes}
                reacciones={post.reacciones}
                onEdit={handlePostActualizado}
                onLike={async () => {
                  try {
                    const response = await fetch(
                      `http://localhost:8080/publicaciones/${post.id}/like`,
                      { method: "PUT" }
                    );
                    if (response.ok) {
                      const data = await response.json();
                      handlePostActualizado(data);
                    }
                  } catch (error) {
                    console.error("❌ Error al dar like:", error);
                  }
                }}
                onReact={async () => {
                  try {
                    const response = await fetch(
                      `http://localhost:8080/publicaciones/${post.id}/reaccion`,
                      { method: "PUT" }
                    );
                    if (response.ok) {
                      const data = await response.json();
                      handlePostActualizado(data);
                    }
                  } catch (error) {
                    console.error("❌ Error al reaccionar:", error);
                  }
                }}
              />
            );
          })
        )}
      </Box>
    </div>
  );
}

export default Home;
