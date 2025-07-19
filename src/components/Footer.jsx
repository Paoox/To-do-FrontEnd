import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0112cbff',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        px: 4, // padding horizontal
        mt: 'auto',
        width: 'auto',
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Blah Network. Todos los derechos reservados.
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          color: '#ffdf57', // Un dorado suave que resalta bien sobre azul
        }}
      >
        Created by PaoxxDev 💻
      </Typography>
    </Box>
  );
}

export default Footer;



