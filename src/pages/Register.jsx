// Importa React y componentes necesarios
import * as React from 'react';

// AppProvider es el proveedor de tema de Toolpad (similar a ThemeProvider de MUI)
import { AppProvider } from '@toolpad/core/AppProvider';

// Importa elementos de diseño de Material UI
import { Container, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// Importa el componente del formulario de registro que tú misma creaste
import RegisterForm from '../components/RegisterForm'; // ✅ Asegúrate que la ruta sea correcta

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
export default function Register() {
  return (
    <AppProvider theme={THEME}>
      <Container maxWidth="sm"> {/* Centra y limita el ancho del contenido */}
        <Box sx={{ mt: 4, mb: 6 }}> {/* Espaciado arriba y abajo */}
          <RegisterForm /> {/* Inserta el formulario que ya programaste */}
        </Box>
      </Container>
    </AppProvider>
  );
}
