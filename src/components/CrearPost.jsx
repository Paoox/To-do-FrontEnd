// src/components/CrearPost.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export default function CrearPost({ usuario, onPublicarSuccess }) {
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const pickerRef = useRef(null);
  const imagenPreview = imagen ? URL.createObjectURL(imagen) : null;

  // 🔒 Cierra el emoji picker si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojis(false);
      }
    };

    if (showEmojis) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojis]);

  // 📤 Maneja cambio de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagen(file);
  };

  // 😄 Agrega emoji al contenido
  const agregarEmoji = (emoji) => {
    setContenido((prev) => prev + emoji.native);
    setShowEmojis(false);
  };

  // ✅ Envía el post al backend (imagen + texto)
  const handlePublicar = async () => {
    if (!contenido.trim()) return;

    const formData = new FormData();
    formData.append('contenido', contenido);
    formData.append('usuarioId', usuario.id);
    if (imagen) formData.append('imagen', imagen);

    try {
      const response = await fetch('https://backend-red-social-blah.fly.dev/publicaciones/crear', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Publicación creada:', data);

        // 🔄 Limpia inputs
        setContenido('');
        setImagen(null);
        setShowEmojis(false);
        if (onPublicarSuccess) onPublicarSuccess();
      } else {
        console.error('❌ Error al publicar');
      }
    } catch (err) {
      console.error('Error en la petición:', err);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 3,
        bgcolor: '#fff',
        boxShadow: 1,
        mb: 4
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* 🧑 Avatar del usuario */}
        <Avatar
          alt={usuario.nombre}
          sx={{ width: 80, height: 80 }}
          src={
            usuario.avatarUrl?.startsWith('/uploads/')
              ? `https://backend-red-social-blah.fly.dev${usuario.avatarUrl}`
              : usuario.avatarUrl
          }
        />

        <Box sx={{ flex: 1 }}>
          {/* 📝 TextArea para escribir el post */}
          <TextField
            multiline
            fullWidth
            rows={3}
            placeholder="¿Qué estás pensando?"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />

          {/* 😃 Botón de emoji justo debajo del textarea */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 1 }}>
            <Tooltip title="Agregar emoji">
              <IconButton onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiEmotionsIcon color="secondary" />
              </IconButton>
            </Tooltip>

            {/* 🎉 Picker de emojis */}
            {showEmojis && (
              <Box
                ref={pickerRef}
                sx={{
                  position: 'absolute',
                  zIndex: 1000,
                  mt: 1
                }}
              >
                <Picker
                  data={data}
                  onEmojiSelect={agregarEmoji}
                  theme="light"
                  previewPosition="none"
                  searchPosition="none"
                />
              </Box>
            )}
          </Box>

          {/* 🖼️ Vista previa de imagen */}
          {imagen && (
            <Box sx={{ mt: 2 }}>
              <img
                src={imagenPreview}
                alt="preview"
                style={{
                  width: '200px',
                  height: 'auto',
                  borderRadius: '10px',
                  objectFit: 'cover'
                }}
              />

              {/* 🗑️ Botón para eliminar imagen */}
              <Box mt={1}>
                <Tooltip title="Eliminar imagen seleccionada">
                  <IconButton color="error" onClick={() => setImagen(null)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}

          {/* 📎 Subir imagen + Publicar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box>
              <input
                accept="image/*"
                type="file"
                id="upload-image"
                hidden
                onChange={handleImagenChange}
              />
              <label htmlFor="upload-image">
                <Tooltip title="Agregar imagen">
                  <IconButton component="span">
                    <ImageIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </label>
            </Box>

            <Button
              variant="contained"
              onClick={handlePublicar}
              disabled={!contenido.trim()}
            >
              Publicar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
