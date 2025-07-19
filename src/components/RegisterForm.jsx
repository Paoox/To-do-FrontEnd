import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    alias: "",
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    numero: "",
  });

  const [errors, setErrors] = useState({
    alias: "",
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    numero: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const validate = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case "alias":
        newErrors.alias = value.trim() === "" ? "Requerido" : "";
        break;
      case "email":
        newErrors.email = !/\S+@\S+\.\S+/.test(value) ? "Email inválido" : "";
        break;
      case "password":
        newErrors.password = !passwordRegex.test(value)
          ? "Debe tener 6 caracteres, 1 mayúscula y 1 número"
          : "";
        break;
      case "confirmPassword":
        newErrors.confirmPassword =
          value !== form.password ? "Las contraseñas no coinciden" : "";
        break;
      case "nombre":
        newErrors.nombre = value.trim() === "" ? "Requerido" : "";
        break;
      case "numero":
        newErrors.numero = !/^\d{8}$/.test(value)
          ? "Debe contener exactamente 8 dígitos numéricos"
          : "";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm({ ...form, [field]: value });
    validate(field, value);
  };

  const isFormValid =
    Object.values(errors).every((e) => e === "") &&
    Object.values(form).every((v) => v !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const usuario = {
      nombre: form.nombre,
      nickname: form.alias.toLowerCase(),
      email: form.email.toLowerCase(),
      password: form.password,
      telefono: form.numero,
      visualizaciones: Math.floor(Math.random() * 100) + 1,
      fechaRegistro: new Date().toISOString(),
      avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      if (res.status === 409) {
        const data = await res.text();
        const nuevosErrores = { ...errors };
        if (data.includes("email")) {
          nuevosErrores.email = "Este correo ya está registrado";
        } else if (data.includes("nickname")) {
          nuevosErrores.alias = "Este alias ya está en uso";
        } else {
          nuevosErrores.email = "Ya existe un usuario con estos datos";
        }
        setErrors(nuevosErrores);
        setForm({ ...form });
        return;
      }

      if (!res.ok) throw new Error("Error al registrar usuario");

      const data = await res.json();
      navigate("/login", {
        state: {
          successMessage: "¡Registro exitoso! Ahora puedes iniciar sesión.",
        },
      });
    } catch (err) {
      console.error("❌ Error en el registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      <Typography variant="h6" mb={2}>
        Crear cuenta
      </Typography>

      <TextField
        fullWidth
        label="Nombre"
        margin="normal"
        required
        value={form.nombre}
        onChange={handleChange("nombre")}
        error={!!errors.nombre}
        helperText={errors.nombre}
      />

      <TextField
        fullWidth
        label="Alias (nickname)"
        margin="normal"
        required
        value={form.alias}
        onChange={handleChange("alias")}
        error={!!errors.alias}
        helperText={errors.alias}
      />

      <TextField
        fullWidth
        label="Número de teléfono"
        margin="normal"
        required
        type="tel"
        value={form.numero}
        onChange={handleChange("numero")}
        error={!!errors.numero}
        helperText={errors.numero}
        inputProps={{ maxLength: 8, inputMode: "numeric", pattern: "[0-9]*" }}
      />

      <TextField
        fullWidth
        label="Correo electrónico"
        margin="normal"
        required
        type="email"
        value={form.email}
        onChange={handleChange("email")}
        error={!!errors.email}
        helperText={errors.email}
      />

      <TextField
        fullWidth
        label="Contraseña"
        margin="normal"
        required
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange("password")}
        error={!!errors.password}
        helperText={errors.password}
        InputProps={{
          endAdornment: (
            <>
              <InputAdornment position="end">
                <Tooltip title="Mínimo 6 caracteres, 1 mayúscula y 1 número">
                  <IconButton tabIndex={-1}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            </>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirmar contraseña"
        margin="normal"
        required
        type={showConfirmPassword ? "text" : "password"}
        value={form.confirmPassword}
        onChange={handleChange("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        disabled={!isFormValid || loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Registrarse"
        )}
      </Button>
    </Box>
  );
}
