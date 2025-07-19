import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Logo({ height = 50, sx = {} }) {
  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <Box
        component="img"
        src="/Logo.png"
        alt="LogoBlah"
        sx={{
          height,
          p: 1,
          m: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out', // 💫 animación suave
          '&:hover': {
            transform: 'scale(1.05)',        // 🔍 pequeño zoom
            opacity: 0.9,                     // 💡 leve transparencia
          },
          ...sx,
        }}
      />
    </Link>
  );
}
