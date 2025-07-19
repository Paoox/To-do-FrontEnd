import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Tooltip,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// 🎉 Emoji Picker
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function PostCard({
  id,
  usuarioId,
  nombre,
  nickname,
  avatarUrl,
  contenido,
  imagenUrl,
  fecha,
  likes = 0,
  reacciones = 0,
  onLike,
  onEdit,
  onDelete,
  onReact,
}) {
  const navigate = useNavigate();

  // 🧠 Estados locales
  const [modoEdicion, setModoEdicion] = useState(false);
  const [contenidoEditado, setContenidoEditado] = useState(contenido);
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [mostrarImagenActual, setMostrarImagenActual] = useState(true);
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const emojiRef = useRef(null);
  const pickerRef = useRef(null);

  // ✅ Usuario autenticado (para ocultar botones si no es el autor)
  const usuarioAutenticado = JSON.parse(localStorage.getItem("usuario"));
  const esPropietario = usuarioAutenticado?.id === usuarioId;

  // 🔒 Cerrar emoji picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !emojiRef.current.contains(event.target)
      ) {
        setMostrarPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarCompleto = avatarUrl?.startsWith("/uploads/")
    ? `http://localhost:8080${avatarUrl}`
    : avatarUrl;

  const fechaFormateada = new Date(fecha).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // ❤️ Like
  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/publicaciones/${id}/like`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (onEdit) onEdit(data);
      } else {
        console.error("❌ Error al dar like");
      }
    } catch (error) {
      console.error("🔥 Error de red al dar like:", error);
    }
  };

  // 😊 Reacción
  const handleReact = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/publicaciones/${id}/reaccion`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (onEdit) onEdit(data);
      } else {
        console.error("❌ Error al reaccionar");
      }
    } catch (error) {
      console.error("🔥 Error de red al reaccionar:", error);
    }
  };

  // 💾 Guardar edición
  const handleGuardarCambios = async () => {
    try {
      const formData = new FormData();
      formData.append("contenido", contenidoEditado);

      if (nuevaImagen) {
        formData.append("imagen", nuevaImagen);
      }

      formData.append("eliminarImagen", (!mostrarImagenActual).toString());

      const response = await fetch(
        `http://localhost:8080/publicaciones/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (onEdit) onEdit(data);
        setModoEdicion(false);
        setMostrarPicker(false);
      } else {
        console.error("❌ Error al actualizar");
      }
    } catch (error) {
      console.error("🔥 Error de red al actualizar:", error);
    }
  };

  // 👉 Ir al perfil del autor
  const handleAvatarClick = () => {
    if (usuarioId) {
      navigate(`/perfil/${usuarioId}`);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        margin: "auto",
        mb: 3,
        borderRadius: 3,
        boxShadow: 3,
        border: "1px solid #1976d2",
        backgroundColor: "#f9fbfd",
      }}
    >
      {/* 👤 Header con avatar y nombre */}
      <CardHeader
        avatar={
          <Avatar
            src={avatarCompleto}
            alt={nombre}
            onClick={handleAvatarClick}
            sx={{ cursor: "pointer" }}
          />
        }
        title={
          <Typography fontWeight="bold" color="primary">
            {nombre} @{nickname}
          </Typography>
        }
        subheader={fechaFormateada}
      />

      {/* ✍️ Contenido o edición */}
      <CardContent sx={{ pb: 1 }}>
        {modoEdicion ? (
          <>
            <TextField
              fullWidth
              multiline
              value={contenidoEditado}
              onChange={(e) => setContenidoEditado(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Emoji Picker */}
            <Box ref={emojiRef}>
              <Tooltip title="Agregar emoji">
                <IconButton onClick={() => setMostrarPicker(!mostrarPicker)}>
                  <SentimentSatisfiedAltIcon />
                </IconButton>
              </Tooltip>
            </Box>
            {mostrarPicker && (
              <Box ref={pickerRef}>
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) =>
                    setContenidoEditado(contenidoEditado + emoji.native)
                  }
                  theme="light"
                />
              </Box>
            )}

            {/* 🖼️ Vista previa imagen actual o nueva (si aplica) */}
            <Box sx={{ mt: 2 }}>
              {nuevaImagen ? (
                <CardMedia
                  component="img"
                  image={URL.createObjectURL(nuevaImagen)}
                  alt="nueva imagen"
                  sx={{
                    maxWidth: 200,
                    maxHeight: 300,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              ) : (
                mostrarImagenActual &&
                imagenUrl && (
                  <CardMedia
                    component="img"
                    image={imagenUrl}
                    alt="imagen actual"
                    sx={{
                      maxWidth: 200,
                      maxHeight: 300,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                )
              )}

              {mostrarImagenActual && imagenUrl && !nuevaImagen && (
                <IconButton onClick={() => setMostrarImagenActual(false)}>
                  <DeleteForeverIcon color="error" />
                </IconButton>
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                component="label"
              >
                Nueva imagen
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setNuevaImagen(e.target.files[0])}
                />
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body1">{contenido}</Typography>
            {imagenUrl && (
              <CardMedia
                component="img"
                image={imagenUrl}
                alt="imagen del post"
                sx={{
                  maxWidth: 200,
                  maxHeight: 300,
                  objectFit: "cover",
                  borderRadius: 2,
                  mt: 2,
                }}
              />
            )}
          </>
        )}
      </CardContent>

      {/* ❤️ Acciones: like, reacción, editar/eliminar */}
      <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
        <Box>
          <Tooltip title="Me gusta">
            <IconButton onClick={handleLike}>
              <FavoriteIcon color="error" />
              <Typography variant="body2" ml={0.5}>
                {likes}
              </Typography>
            </IconButton>
          </Tooltip>

          <Tooltip title="Reaccionar">
            <IconButton onClick={handleReact}>
              <SentimentSatisfiedAltIcon color="primary" />
              <Typography variant="body2" ml={0.5}>
                {reacciones}
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>

        {/* 🛠️ Solo si es el dueño del post */}
        {esPropietario && (
          <Box>
            {modoEdicion ? (
              <>
                <Tooltip title="Guardar cambios">
                  <IconButton onClick={handleGuardarCambios}>
                    <Typography variant="body2">✅</Typography>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Cancelar edición">
                  <IconButton
                    onClick={() => {
                      setModoEdicion(false);
                      setContenidoEditado(contenido);
                      setNuevaImagen(null);
                      setMostrarImagenActual(true);
                      setMostrarPicker(false);
                    }}
                  >
                    <Typography variant="body2">❌</Typography>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Editar publicación">
                  <IconButton onClick={() => setModoEdicion(true)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar publicación">
                  <IconButton onClick={onDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        )}
      </CardActions>
    </Card>
  );
}
