import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Iconos para mostrar/ocultar contraseña
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function ResetPassword() {
  const navigate = useNavigate();

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usuarioValido, setUsuarioValido] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Mostrar/Ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Expresión regular para validar contraseña segura
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

  // Paso 1: Verifica que el email exista en el sistema
  const verificarCorreo = async () => {
    setLoading(true);
    setMensaje(null);
    setError(null);

    try {
      const res = await fetch(`https://backend-red-social-blah.fly.dev/usuarios/email/${email}`);
      if (!res.ok) throw new Error('Correo no encontrado');
      setUsuarioValido(true);
      setMensaje('Correo válido. Ahora puedes ingresar tu nueva contraseña.');
    } catch (err) {
      setError('❌ El correo no está registrado.');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Cambiar la contraseña
  const cambiarPassword = async () => {
    if (error) return; // Evita enviar si hay error previo

    setLoading(true);
    setMensaje(null);
    setError(null);

    // Validaciones
    if (newPassword !== confirmPassword) {
      setError('❌ Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setError('❌ Mínimo 6 caracteres, 1 mayúscula y 1 número.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://backend-red-social-blah.fly.dev/usuarios/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!res.ok) throw new Error('Error al actualizar la contraseña');

      setMensaje('✅ Contraseña actualizada. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('❌ Hubo un problema al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Restablecer contraseña
        </Typography>

        {mensaje && (
          <Typography sx={{ color: 'green', mt: 2 }}>{mensaje}</Typography>
        )}
        {error && (
          <Typography sx={{ color: 'red', mt: 2 }}>{error}</Typography>
        )}

        {!usuarioValido ? (
          <>
            {/* Paso 1: Verificar correo */}
            <TextField
              label="Correo electrónico"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              fullWidth
              variant="contained"
              onClick={verificarCorreo}
              disabled={loading || email.trim() === ''}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verificar correo'}
            </Button>
          </>
        ) : (
          <>
            {/* Paso 2: Nueva contraseña */}
            <TextField
              label="Nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Confirmar nueva contraseña"
              type={showConfirm ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={cambiarPassword}
              disabled={loading || newPassword === '' || confirmPassword === ''}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Actualizar contraseña'}
            </Button>

            {/* Botón para volver manualmente al login */}
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{ mt: 1 }}
            >
              Volver al login
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}
