import * as React from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mensaje que llega desde el registro exitoso (opcional)
  const successMessage = location.state?.successMessage || null;

  // Estados del formulario
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false); // 👁️ Mostrar u ocultar la contraseña

  // Detectar si hay un token de sesión en localStorage
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  // 🔐 Intentar iniciar sesión
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://backend-red-social-blah.fly.dev/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Error en el login');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      window.dispatchEvent(new Event('storage'));
      navigate('/perfil');
    } catch (err) {
      console.error('❌ Error al iniciar sesión:', err);
      setErrorMessage(err.message);
    }
  };

  // 🚪 Cerrar sesión y limpiar datos
  const handleLogout = () => {
  // 🧹 Limpiar datos del usuario
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  setEmail('');
  setPassword('');
  setErrorMessage(null);

  // 🔄 Redirigir directamente al login (evita recargar la página completa)
  navigate('/login');
};


  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {isLoggedIn ? 'Sesión activa' : 'Iniciar sesión'}
        </Typography>

        {/* ✅ Mostrar mensaje exitoso desde registro */}
        {successMessage && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#d1e7dd', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#0f5132' }}>
              {successMessage}
            </Typography>
          </Box>
        )}

        {/* ❌ Mensaje de error al iniciar sesión */}
        {errorMessage && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#f8d7da', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#842029' }}>
              {errorMessage}
            </Typography>
          </Box>
        )}

        {/* 🔐 Formulario si NO está logueado */}
        {!isLoggedIn ? (
          <form onSubmit={handleLogin}>
            <TextField
              label="Correo electrónico"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              label="Contraseña"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Iniciar sesión
            </Button>
          </form>
        ) : (
          // 🔒 Si ya está logueado, mostrar botón de cerrar sesión
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </Box>
        )}

        {/* 📌 Enlaces solo si NO está logueado */}
        {!isLoggedIn && (
          <>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                ¿No tienes cuenta?{' '}
                <MuiLink
                  component="button"
                  onClick={() => navigate('/register')}
                  underline="hover"
                  sx={{ fontWeight: 'bold' }}
                >
                  Crear cuenta
                </MuiLink>
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <MuiLink
                component="button"
                onClick={() => navigate('/reset-password')}
                underline="hover"
                sx={{ fontSize: '0.875rem', fontStyle: 'italic' }}
              >
                ¿Olvidaste tu contraseña?
              </MuiLink>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
