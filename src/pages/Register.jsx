// src/pages/Register.jsx
import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
// Importa elementos de diseño de Material UI
import { Container, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
// Importa el componente del formulario de registro 
import RegisterForm from '../components/RegisterForm'; // ✅ Asegurar que la ruta sea correcta


// 🎨 Define un tema personalizado usando el sistema de theming de Material UI
const THEME = createTheme({
  palette: {
    mode: 'light', // Modo claro
    primary: {
      main: '#0112cb', // Color azul personalizado (botones, inputs activos, etc.)
    },
  },
});

// 🧾 Componente de la vista Register
// Aquí se aplica el tema y se centra el formulario usando Container y Box
export default function Register({ onActualizar }) {
  return (
    <AppProvider theme={THEME}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 6 }}>
          <RegisterForm onActualizar={onActualizar} />
        </Box>
      </Container>
    </AppProvider>
  );
}

