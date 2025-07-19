// src/components/Navbar.jsx
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Box, Toolbar, IconButton, Typography,
  InputBase, Badge, MenuItem, Menu, Drawer, List,
  ListItem, ListItemButton, ListItemText, Divider, Avatar
} from '@mui/material';

import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';

import Logo from './Logo';

// 🎨 Estilos para la barra de búsqueda
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

// 🧠 Componente principal
export default function Navbar({ setTerminoBusqueda }) {
  const navigate = useNavigate();

  const [usuario, setUsuario] = React.useState(JSON.parse(localStorage.getItem('usuario')));
  const [isLoggedIn, setIsLoggedIn] = React.useState(Boolean(usuario));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [msgCount, setMsgCount] = React.useState(0);
  const [notiCount, setNotiCount] = React.useState(0);

  const isMenuOpen = Boolean(anchorEl);

  // 🔁 Escucha cambios en el localStorage (sesión)
  React.useEffect(() => {
    const actualizarUsuario = () => {
      const guardado = JSON.parse(localStorage.getItem('usuario'));
      setUsuario(guardado);
      setIsLoggedIn(Boolean(guardado));
    };

    window.addEventListener('storage', actualizarUsuario);
    return () => window.removeEventListener('storage', actualizarUsuario);
  }, []);

  // 🎯 Al iniciar sesión, genera números aleatorios para los íconos
  React.useEffect(() => {
    if (isLoggedIn) {
      setMsgCount(Math.floor(Math.random() * 20) + 1);
      setNotiCount(Math.floor(Math.random() * 20) + 1);
    }
  }, [isLoggedIn]);

  // 🔐 Logout completo
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setIsLoggedIn(false);
    setAnchorEl(null);
    navigate('/login');
    window.location.reload(); // 🔄 Fuerza recarga
  };

  // 🔁 Manejadores de menú y drawer
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  // 📦 Menú superior
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="menu-appbar"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isLoggedIn && (
        <MenuItem onClick={() => { handleMenuClose(); navigate('/perfil'); }}>
          Perfil
        </MenuItem>
      )}
      {isLoggedIn ? (
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      ) : (
        <MenuItem onClick={() => navigate('/login')}>Iniciar sesión</MenuItem>
      )}
    </Menu>
  );

  // 📱 Menú lateral
  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>
        {isLoggedIn && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/perfil">
                <ListItemText primary="Perfil" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/configuracion">
                <ListItemText primary="Configuración" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#0112cbff' }}>
        <Toolbar>
          {/* ☰ Botón del menú lateral */}
          <IconButton size="large" edge="start" color="inherit" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          {/* 🏷️ Logo */}
          <Typography variant="h6" noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Logo />
          </Typography>

          {/* 🔍 Caja de búsqueda */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => setTerminoBusqueda(e.target.value)} // 👈 Esto actualiza el término global
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* 🔔 Iconos de mensajes y notificaciones */}
          {isLoggedIn && (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" color="inherit" onClick={() => navigate('/perfil')}>
                <Badge badgeContent={msgCount} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" color="inherit" onClick={() => navigate('/perfil')}>
                <Badge badgeContent={notiCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>
          )}

          {/* 👤 Avatar o icono de cuenta */}
          <IconButton
            size="large"
            edge="end"
            aria-label="cuenta actual"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            {isLoggedIn && usuario?.avatarUrl ? (
              <Avatar
                alt={usuario.nombre}
                src={
                  usuario.avatarUrl.startsWith('/uploads/')
                    ? `https://backend-red-social-blah.fly.dev${usuario.avatarUrl}`
                    : usuario.avatarUrl
                }
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {renderMenu}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </Box>
  );
}
