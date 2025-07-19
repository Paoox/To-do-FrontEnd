// src/pages/Login.jsx
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
  const backend = import.meta.env.VITE_BACKEND_URL;

  const successMessage = location.state?.successMessage || null;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backend}/usuarios/login`, {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setEmail('');
    setPassword('');
    setErrorMessage(null);
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {isLoggedIn ? 'Sesión activa' : 'Iniciar sesión'}
        </Typography>

        {successMessage && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#d1e7dd', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#0f5132' }}>
              {successMessage}
            </Typography>
          </Box>
        )}

        {errorMessage && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#f8d7da', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#842029' }}>
              {errorMessage}
            </Typography>
          </Box>
        )}

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
