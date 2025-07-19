# 🌐 Red Social - Frontend (React + Vite)

Este es el frontend de una red social ficticia construida con **React** y **Material UI**, conectada a un backend en Spring Boot. Permite registrar usuarios, iniciar sesión, editar su perfil, crear publicaciones y navegar por otras cuentas.

---

## 🚀 Tecnologías utilizadas

- **React 19**
- **Vite** (entorno de desarrollo rápido)
- **Material UI** (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`)
- **React Router DOM** (ruteo SPA)
- **JavaScript (ES6+)**
- **Fetch API** para consumo del backend
- **@toolpad/core** (estética base de login)

---

## 📁 Estructura de carpetas
```
src/
├── components/ # Componentes reutilizables (Navbar, PostCard, etc.)
├── pages/ # Páginas principales (Home, Perfil, Configuración, etc.)
├── App.jsx # Configuración de rutas y layout base
├── main.jsx # Punto de entrada principal
└── assets/ # Imágenes, íconos u otros recursos
```

---

## 📄 Páginas implementadas y funcionalidades

### 🔐 `/login`
- Estilo basado en `SignInPage` de Toolpad.
- Login por email y contraseña.
- Muestra errores de autenticación desde el backend.
- Redirige a `/perfil` tras iniciar sesión.
- Muestra mensaje si vienes desde `/registro`.

### 📝 `/registro`
- Formulario con validaciones:
  - Email válido
  - Contraseñas que coincidan y cumplan regex (`1 mayúscula, 1 número, 6+ caracteres`)
  - Alias único (nickname)
  - Teléfono de 8 dígitos
- Avatar aleatorio generado automáticamente.
- Visualizaciones y fecha de registro generadas automáticamente.
- Muestra errores si el correo o alias ya existen.

### 🏠 `/` (Inicio)
- Muestra publicaciones de todos los usuarios.
- Cards con contenido, imagen, fecha, y avatar del autor.
- Incluye barra de búsqueda para filtrar publicaciones por palabra clave.
- Redirige al perfil del autor al hacer clic en su avatar.

### 🙋 `/perfil`
- Muestra los datos del usuario autenticado.
- Permite crear nuevas publicaciones (con o sin imagen).
- Lista solo las publicaciones del usuario actual.

### ⚙️ `/configuracion`
- Permite editar: nombre, alias, teléfono, descripción y avatar.
- Permite eliminar la cuenta del usuario logueado.
- El avatar se muestra en tiempo real (drag & drop).

---

## 🧩 Componentes importantes

### `Navbar.jsx`
- Íconos de notificaciones y mensajes (falsos, con contador aleatorio).
- Búsqueda integrada que filtra publicaciones directamente en `/`.
- Botón de logout que limpia `localStorage` y redirige a `/login`.

### `PostCard.jsx`
- Muestra una publicación con avatar, texto e imagen.
- Permite editar o eliminar la publicación si es del usuario actual.
- Usa `emoji-button` para agregar emojis.
- Permite reemplazar o eliminar imagen existente.
- Redirige al perfil del autor al hacer clic en su avatar.

### `CrearPost.jsx`
- Formulario para crear publicaciones desde el perfil.
- Permite cargar imagen y texto, con emoji picker.
- Valida longitud mínima antes de enviar.

### `Configuracion.jsx`
- Dividido en 2 columnas:
  - Izquierda: avatar editable
  - Derecha: formulario de perfil
- Permite editar datos del usuario o eliminar la cuenta.

### `TablaUsuarios.jsx`
- Tabla estilo admin hecha con `@mui/x-data-grid`.
- Muestra usuarios registrados (con avatar, nombre, alias, fecha).
- Redirige al perfil del usuario al hacer clic en su avatar.

---

## ⚙️ Cómo instalar y correr el proyecto

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/red-social-frontend.git
cd red-social-frontend

# Instala dependencias
npm install

# Corre el servidor de desarrollo
npm run dev
```
Asegúrate de que el backend esté corriendo en http://localhost:8080

🔐 Consideraciones
El sistema usa JWT para autenticación.

El token se guarda en localStorage al iniciar sesión.

Las rutas privadas validan que haya sesión activa.

✨ Créditos
Proyecto creado por Paola Arreola como parte de su portafolio profesional.

Frontend con React + Material UI + Vite. Backend disponible en Spring Boot + PostgreSQL + Docker.

