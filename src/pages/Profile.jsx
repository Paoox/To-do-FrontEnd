import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, Divider, Paper, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import CrearPost from "../components/CrearPost";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { id: idParam } = useParams();
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [usuario, setUsuario] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);

  const esMiPerfil =
    !idParam || parseInt(idParam) === parseInt(usuarioLogueado?.id);

  const fetchUsuario = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/usuarios/${id}`);
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      console.error("❌ Error al cargar usuario:", error);
    }
  };

  useEffect(() => {
    const idFinal = idParam || usuarioLogueado?.id;
    if (idFinal) fetchUsuario(idFinal);
  }, [idParam]);

  const fetchPublicaciones = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/publicaciones/usuario/${userId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setPublicaciones(data.reverse());
      } else {
        console.error("❌ El backend no devolvió un arreglo:", data);
      }
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  };

  useEffect(() => {
    if (usuario?.id) fetchPublicaciones(usuario.id);
  }, [usuario?.id]);

  const handleDeletePost = async (postId) => {
    const confirmacion = window.confirm("¿Estás segura/o de eliminar esta publicación?");
    if (!confirmacion) return;

    try {
      const response = await fetch(`${BACKEND_URL}/publicaciones/eliminar/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPublicaciones(usuario.id);
      } else {
        const texto = await response.text();
        alert("Error al eliminar: " + texto);
      }
    } catch (error) {
      console.error("❌ Error al eliminar publicación:", error);
      alert("Error de conexión al intentar eliminar la publicación.");
    }
  };

  const handleEditPost = (postActualizado) => {
    setPublicaciones((prev) =>
      prev.map((p) => (p.id === postActualizado.id ? postActualizado : p))
    );
  };

  if (!usuario) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h6">Cargando perfil...</Typography>
      </Box>
    );
  }

  const {
    nombre,
    nickname,
    descripcion,
    visualizaciones,
    fechaRegistro,
    avatarUrl,
  } = usuario;

  const avatarCompleto = avatarUrl?.startsWith("/uploads/")
    ? `${BACKEND_URL}${avatarUrl}`
    : avatarUrl;

  const fechaFormateada = new Date(fechaRegistro).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, mb: 8, px: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Avatar src={avatarCompleto} alt={nombre} sx={{ width: 200, height: 200, mb: 2 }} />
        <Typography variant="h5" fontWeight="bold">{nombre}</Typography>
        <Typography variant="subtitle1" color="text.secondary">@{nickname}</Typography>
        {descripcion && (
          <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
            {descripcion}
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Grid container spacing={3} sx={{ maxWidth: 600 }} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">Publicaciones</Typography>
              <Typography variant="h6">{publicaciones.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">Visualizaciones</Typography>
              <Typography variant="h6">
                {visualizaciones !== undefined && visualizaciones !== null
                  ? visualizaciones
                  : "❌ Sin datos"}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">Miembro desde</Typography>
              <Typography variant="h6">{fechaFormateada}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {esMiPerfil && (
        <CrearPost usuario={usuario} onPublicarSuccess={() => fetchPublicaciones(usuario.id)} />
      )}

      {publicaciones.map((post) => {
        const avatarPost = post.usuario.avatarUrl?.startsWith("/uploads/")
          ? `${BACKEND_URL}${post.usuario.avatarUrl}`
          : post.usuario.avatarUrl;

        const imagenCompleta = post.imagenUrl?.startsWith("/uploads/")
          ? `${BACKEND_URL}${post.imagenUrl}`
          : post.imagenUrl;

        return (
          <PostCard
            key={post.id}
            id={post.id}
            usuarioId={post.usuario.id}
            nombre={post.usuario.nombre}
            nickname={post.usuario.nickname}
            avatarUrl={avatarPost}
            contenido={post.contenido}
            imagenUrl={imagenCompleta}
            fecha={post.fechaCreacion}
            likes={post.likes}
            reacciones={post.reacciones}
            onLike={() => console.log("Like", post.id)}
            onReact={() => console.log("Reacción", post.id)}
            onEdit={handleEditPost}
            onDelete={() => handleDeletePost(post.id)}
          />
        );
      })}
    </Box>
  );
}
