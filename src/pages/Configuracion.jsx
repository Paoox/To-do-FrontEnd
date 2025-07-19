import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

export default function Configuracion({ onActualizar }) {
  const navigate = useNavigate();
  const usuarioStorage = JSON.parse(localStorage.getItem("usuario")) || {};

  const [usuario, setUsuario] = useState({
    nombre: usuarioStorage.nombre || "",
    nickname: usuarioStorage.nickname || "",
    telefono: usuarioStorage.telefono || "",
    email: usuarioStorage.email || "",
    descripcion: usuarioStorage.descripcion || "",
    avatar: null,
    avatarUrl: usuarioStorage.avatarUrl || "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // 👉 Estados y refs para el emoji picker de descripción
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const pickerRef = useRef(null);

  // 👉 Cerrar picker al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        !emojiRef.current.contains(e.target)
      ) {
        setMostrarEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📦 Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const archivo = acceptedFiles[0];
      setUsuario((prev) => ({
        ...prev,
        avatar: archivo,
        avatarUrl: URL.createObjectURL(archivo),
      }));
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // 💾 Guardar cambios
  const handleGuardar = async () => {
    setCargando(true);
    setMensaje("");
    setError("");

    const telefonoRegex = /^\d{8}$/;
    if (!telefonoRegex.test(usuario.telefono)) {
      setError("❌ El número de teléfono debe tener exactamente 8 dígitos");
      setCargando(false);
      return;
    }

    try {
      let avatarUrlFinal = usuario.avatarUrl;

      if (usuario.avatar) {
        const formData = new FormData();
        formData.append("archivo", usuario.avatar);

        const resAvatar = await fetch(
          `http://localhost:8080/usuarios/${usuarioStorage.id}/avatar`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!resAvatar.ok) throw new Error("❌ Error al subir el avatar");

        const data = await resAvatar.json();
        avatarUrlFinal = data.url;
      }

      const datosActualizados = {
        nombre: usuario.nombre,
        nickname: usuario.nickname,
        telefono: usuario.telefono,
        email: usuario.email,
        descripcion: usuario.descripcion, // ✅ Mantiene los emojis
        avatarUrl: avatarUrlFinal,
        password: usuarioStorage.password || "temporal",
      };

      const resUser = await fetch(
        `http://localhost:8080/usuarios/${usuarioStorage.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (!resUser.ok) throw new Error("❌ Error al guardar los cambios");

      const actualizado = await resUser.json();
      localStorage.setItem("usuario", JSON.stringify(actualizado));
      window.dispatchEvent(new Event("storage"));

      setUsuario((prev) => ({
        ...prev,
        avatar: null,
        avatarUrl: actualizado.avatarUrl,
      }));

      setMensaje("✅ Datos actualizados correctamente");
      if (onActualizar) onActualizar();
    } catch (err) {
      setError(err.message || "❌ No se pudieron guardar los cambios");
    } finally {
      setCargando(false);
    }
  };

  // 🗑️ Eliminar cuenta
  const handleEliminarCuenta = async () => {
    const confirmar = window.confirm(
      "¿Deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    );
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:8080/usuarios/${usuarioStorage.id}`, {
        method: "DELETE",
      });

      localStorage.removeItem("usuario");
      localStorage.removeItem("token");

      if (onActualizar) onActualizar();
      window.location.href = "/login";
    } catch (err) {
      alert("❌ Error al eliminar la cuenta");
    }
  };

  return (
    <Box sx={{ mt: 6, mb: 8, px: { xs: 2, md: 6 } }}>
      <Typography variant="h5" align="center" gutterBottom>
        Configuración de cuenta
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mt: 4,
        }}
      >
        {/* 📸 Avatar */}
        <Box
          {...getRootProps()}
          sx={{
            flex: 1,
            height: 350,
            border: "2px dashed #ccc",
            borderRadius: 2,
            bgcolor: "#f9f9f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            textAlign: "center",
            px: 2,
          }}
        >
          <input {...getInputProps()} />
          {usuario.avatar ? (
            <img
              src={URL.createObjectURL(usuario.avatar)}
              alt="Nuevo avatar"
              style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 10 }}
            />
          ) : usuario.avatarUrl ? (
            <img
              src={
                usuario.avatarUrl.startsWith("/uploads/")
                  ? `http://localhost:8080${usuario.avatarUrl}`
                  : usuario.avatarUrl
              }
              alt="Avatar actual"
              style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 10 }}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              Arrastra o haz clic para subir un avatar
            </Typography>
          )}
        </Box>

        {/* 📝 Formulario */}
        <Box sx={{ flex: 2 }}>
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            value={usuario.nombre}
            onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
          />
          <TextField
            label="Alias (nickname)"
            fullWidth
            margin="normal"
            value={usuario.nickname}
            onChange={(e) =>
              setUsuario({ ...usuario, nickname: e.target.value })
            }
          />
          <TextField
            label="Teléfono"
            fullWidth
            margin="normal"
            value={usuario.telefono}
            onChange={(e) => {
              const valor = e.target.value;
              if (/^\d{0,10}$/.test(valor)) {
                setUsuario({ ...usuario, telefono: valor });
              }
            }}
          />
          <TextField
            label="Correo electrónico"
            fullWidth
            margin="normal"
            value={usuario.email}
            InputProps={{ readOnly: true }}
          />

          {/* 🆕 Campo de descripción con emoji picker */}
          <Box sx={{ position: "relative", mb: 2 }}>
            <TextField
              label="Sobre mí"
              fullWidth
              multiline
              rows={3}
              value={usuario.descripcion}
              onChange={(e) =>
                setUsuario({ ...usuario, descripcion: e.target.value })
              }
            />

            <IconButton
              ref={emojiRef}
              onClick={() => setMostrarEmojiPicker(!mostrarEmojiPicker)}
              sx={{ position: "absolute", bottom: 15, right: 10 }}
            >
              <SentimentSatisfiedAltIcon color="primary" />
            </IconButton>

            {mostrarEmojiPicker && (
              <Box
                ref={pickerRef}
                sx={{
                  position: "absolute",
                  bottom: 60,
                  right: 0,
                  zIndex: 9999,
                }}
              >
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) =>
                    setUsuario((prev) => ({
                      ...prev,
                      descripcion: prev.descripcion + emoji.native,
                    }))
                  }
                  theme="light"
                  previewPosition="none"
                />
              </Box>
            )}
          </Box>

          {/* 💾 Botón guardar */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleGuardar}
              disabled={cargando}
            >
              {cargando ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </Box>

          {mensaje && (
            <Typography color="green" sx={{ mt: 2 }}>
              {mensaje}
            </Typography>
          )}
          {error && (
            <Typography color="red" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>

      {/* 🗑️ Eliminar cuenta */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ borderTop: "2px solid #ccc", mt: 4, mb: 3 }} />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleEliminarCuenta}
            sx={{ px: 5 }}
          >
            Eliminar cuenta
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
