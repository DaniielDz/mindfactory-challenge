# Frontend - MindFactory Challenge

Aplicación web desarrollada con **React** y **Vite** para el sistema de gestión de usuarios y publicaciones. Interfaz moderna y responsiva con autenticación, formularios validados, y gestión de estado.

## 🛠 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **Styling**: TailwindCSS v4
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **UI Components**: lucide-react (iconos), sonner (toasts)
- **TypeScript**: Tipado estático completo
- **Testing**: Vitest + Testing Library

## 📂 Estructura del Proyecto

```text
frontend/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/               # Componentes UI base (Button, InputField, TextAreaField)
│   │   ├── layout/           # Componentes de layout (Layout, Navbar)
│   │   ├── auth/             # Componentes de autenticación (AuthLayout)
│   │   ├── posts/            # Componentes de posts (PostCard, PostForm, CreatePostForm, EditPostModal)
│   │   └── profile/          # Componentes de perfil (ProfileHeader, ProfilePosts, EditProfileForm)
│   ├── pages/                # Páginas de la aplicación
│   │   ├── FeedPage.tsx      # Página principal de feed
│   │   ├── LoginPage.tsx     # Página de login
│   │   ├── RegisterPage.tsx  # Página de registro
│   │   ├── PostDetailPage.tsx # Página de detalle de post
│   │   ├── ProfilePage.tsx   # Página de perfil
│   │   └── *.test.tsx        # Tests de páginas
│   ├── context/              # React Contexts
│   │   ├── AuthContext.tsx   # Contexto de autenticación
│   │   └── AuthProvider.tsx  # Provider de autenticación
│   ├── hooks/                # Custom hooks
│   │   └── useAuth.ts        # Hook de autenticación
│   ├── services/             # Servicios de API
│   │   ├── auth.ts           # Servicio de autenticación
│   │   ├── posts.ts          # Servicio de posts
│   │   └── users.ts          # Servicio de usuarios
│   ├── schemas/              # Esquemas de validación Zod
│   │   ├── auth.ts           # Esquemas de autenticación
│   │   ├── posts.ts          # Esquemas de posts
│   │   └── user.ts           # Esquemas de usuario
│   ├── lib/                  # Configuración
│   │   └── axios.ts          # Cliente HTTP configurado
│   ├── utils/                # Utilidades
│   │   └── api-error.ts      # Manejo de errores de API
│   ├── types/                # Tipos TypeScript
│   │   ├── auth.ts           # Tipos de autenticación
│   │   └── post.ts           # Tipos de posts
│   ├── test/                 # Configuración de tests
│   │   └── setup.ts          # Setup de Vitest
│   ├── assets/               # Assets estáticos
│   ├── App.tsx               # Componente principal
│   ├── main.tsx              # Punto de entrada
│   └── index.css             # Estilos globales
├── public/                   # Archivos estáticos públicos
├── index.html                # HTML template
└── vite.config.ts            # Configuración de Vite
```

## 📥 Instalación

### 1. Instalar dependencias

```bash
cd frontend
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
```

## 🗄️ Variables de Entorno

| Variable       | Descripción         | Valor por defecto     | Requerida |
| -------------- | ------------------- | --------------------- | --------- |
| `VITE_API_URL` | URL del backend API | http://localhost:3000 | ✅        |

## 📜 Scripts Disponibles

### Desarrollo

```bash
pnpm dev                # Inicia servidor de desarrollo (puerto 5173)
```

La aplicación se abrirá en http://localhost:5173

### Producción

```bash
pnpm build              # Compila el proyecto para producción
pnpm preview            # Preview del build de producción
```

### Testing

```bash
pnpm test               # Ejecuta tests con Vitest en modo watch
```

### Linting y Formato

```bash
pnpm lint               # Ejecuta ESLint
pnpm format             # Formatea código con Prettier
```

## 🔐 Autenticación

### AuthContext

El contexto de autenticación maneja:

- Login y registro de usuarios
- Almacenamiento de estado del usuario
- Logout

## 📋 Formularios

### React Hook Form + Zod

Los formularios utilizan React Hook Form para manejo de estado y Zod para validación

## 🛣️ Rutas

| Ruta           | Componente     | Descripción            | Protegida |
| -------------- | -------------- | ---------------------- | --------- |
| `/`            | FeedPage       | Feed de publicaciones  | ❌        |
| `/login`       | LoginPage      | Iniciar sesión         | ❌        |
| `/register`    | RegisterPage   | Registro               | ❌        |
| `/post/:id`    | PostDetailPage | Detalle de publicación | ❌        |
| `/profile/:id` | ProfilePage    | Perfil de usuario      | ❌        |

## 🧪 Testing

### Estructura de Tests

- **Tests Unitarios**: Componentes individuales
- **Tests de Integración**: Flujos completos

### Ejecutar Tests

```bash
# Tests en modo watch
pnpm test
```

### Configuración

El proyecto usa **Vitest** con **Testing Library**:

- **@testing-library/react**: Renderizado de componentes
- **@testing-library/user-event**: Simulación de interacciones
- **@testing-library/jest-dom**: Matchers adicionales
- **jsdom**: Simulación de DOM

## 🌐 HTTP Client

### Axios

El cliente HTTP está configurado en `src/lib/axios.ts`:

- BaseURL configurada desde variables de entorno
- Interceptors para manejo de errores
- Cookies automáticas (`withCredentials: true`)

## 🏗️ Arquitectura

### Patrón de Componentes

- **Pages**: Componentes de página (rutas)
- **Components**: Componentes reutilizables
- **Contexts**: Estado global con React Context
- **Lib**: Configuración y utilidades

### Estado Global

Se utiliza **React Context** para:

- Autenticación
- Estado del usuario

### Tipos TypeScript

Todos los componentes, funciones y APIs están completamente tipados con TypeScript para mayor seguridad y autocompletado.

## 📱 Características

### Autenticación

- ✅ Registro de usuarios
- ✅ Login con validación
- ✅ Logout
- ✅ Persistencia de sesión
- ✅ Protección de rutas

### Gestión de Publicaciones

- ✅ Listar todas las publicaciones
- ✅ Crear nueva publicación
- ✅ Editar publicaciones propias
- ✅ Validación de formularios

### Perfil de Usuario

- ✅ Ver información del usuario
- ✅ Actualizar perfil
- ✅ Validación de datos

### UX/UI

- ✅ Diseño responsivo
- ✅ Notificaciones toast
- ✅ Validación en tiempo real
- ✅ Manejo de estados de carga
- ✅ Manejo de errores

## 👨‍💻 Autor

**DaniielDz**
