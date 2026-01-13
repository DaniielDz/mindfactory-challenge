# MindFactory Fullstack Challenge

Solución completa para el desafío técnico Fullstack de MindFactory. Este proyecto implementa un sistema de gestión de usuarios y publicaciones utilizando una arquitectura moderna con **NestJS** para el backend y **React** para el frontend.

## 📋 Descripción

Aplicación fullstack que permite a los usuarios:

- Registrarse y autenticarse de forma segura
- Crear y gestionar publicaciones
- Actualizar su perfil de usuario
- Visualizar publicaciones de otros usuarios

El proyecto está estructurado como un **monorepo** utilizando **pnpm workspaces** para facilitar la orquestación de servicios y el desarrollo local.

## 🛠 Tech Stack

### Backend

- **Framework**: NestJS (Node.js + TypeScript)
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT + Passport
- **Validación**: class-validator + class-transformer

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Router**: React Router v7
- **Styling**: TailwindCSS v4
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **UI Components**: lucide-react, sonner

### DevOps

- **Gestión de Paquetes**: pnpm
- **Contenerización**: Docker & Docker Compose
- **Testing**: Jest (backend), Vitest (frontend)

## 📂 Estructura del Proyecto

```text
mindfactory-challenge/
├── backend/                  # API REST (NestJS + Prisma)
│   ├── src/
│   │   ├── auth/             # Módulo de autenticación (DTOs, guards, strategies)
│   │   ├── users/            # Módulo de usuarios (DTOs, service, controller)
│   │   ├── posts/            # Módulo de publicaciones (DTOs, service, controller)
│   │   └── prisma/           # Servicio Prisma
│   ├── prisma/               # Esquema y migraciones
│   ├── generated/            # Cliente Prisma generado
│   └── test/                 # Tests E2E
├── frontend/                 # Aplicación React (Vite)
│   ├── src/
│   │   ├── components/       # Componentes reutilizables (UI, layout, posts, profile)
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── context/          # Contexto de autenticación
│   │   ├── hooks/            # Custom hooks (useAuth)
│   │   ├── services/         # Servicios de API (auth, posts, users)
│   │   ├── schemas/          # Esquemas de validación Zod
│   │   ├── lib/              # Configuración (axios)
│   │   ├── utils/            # Utilidades
│   │   └── types/            # Tipos TypeScript
│   └── public/               # Archivos estáticos
├── docker-compose.yml        # Configuración de Docker (PostgreSQL)
└── pnpm-workspace.yaml       # Configuración del monorepo
```

## 🚀 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x
- **pnpm** >= 10.x (se recomienda instalar con: `npm install -g pnpm`)
- **Docker** y **Docker Compose** (para la base de datos)

## 📥 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd mindfactory-challenge
```

### 2. Instalar dependencias

```bash
pnpm install
```

Esto instalará todas las dependencias del monorepo (root, backend y frontend).

### 3. Configurar variables de entorno

#### Root (Docker Compose)

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de base de datos si es necesario.

#### Backend

```bash
cp backend/.env.example backend/.env
```

**Variables importantes:**

- `DATABASE_URL`: Connection string de PostgreSQL
- `JWT_SECRET`: Secreto para firmar tokens JWT (cámbialo en producción)
- `PORT`: Puerto del servidor (por defecto: 3000)

#### Frontend

```bash
cp frontend/.env.example frontend/.env
```

**Variables importantes:**

- `VITE_API_URL`: URL del backend (por defecto: http://localhost:3000)

### 4. Iniciar la base de datos

```bash
docker-compose up -d
```

Esto iniciará un contenedor de PostgreSQL en el puerto especificado en `.env`.

### 5. Ejecutar migraciones

```bash
cd backend
pnpm prisma generate
pnpm prisma migrate dev
cd ..
```

## 🎯 Scripts Disponibles

### Desarrollo (ejecutar ambos servicios)

```bash
pnpm dev
```

Esto iniciará:

- Backend en http://localhost:3000
- Frontend en http://localhost:5173

### Build (compilar ambos proyectos)

```bash
pnpm build
```

### Testing (ejecutar tests de ambos proyectos)

```bash
pnpm test
```

### Ejecutar servicios individualmente

#### Backend solamente

```bash
pnpm --filter backend start:dev
```

#### Frontend solamente

```bash
pnpm --filter frontend dev
```

## 🗄️ Migraciones de Base de Datos

El proyecto utiliza **Prisma** como ORM. Los comandos importantes son:

### Generar cliente Prisma

```bash
cd backend
pnpm prisma generate
```

### Crear una nueva migración

```bash
cd backend
pnpm prisma migrate dev --name nombre_de_la_migracion
```

### Aplicar migraciones en producción

```bash
cd backend
pnpm prisma migrate deploy
```

### Visualizar la base de datos

```bash
cd backend
pnpm prisma studio
```

Esto abrirá una interfaz web para explorar la base de datos.

## 🧪 Testing

### Backend (Jest)

```bash
cd backend
pnpm test # Tests unitarios
pnpm test:e2e # Tests E2E
pnpm test:cov # Cobertura
```

### Frontend (Vitest)

```bash
cd frontend
pnpm test # Tests en modo watch (Vitest)
```

## 🐳 Docker

### Iniciar base de datos

```bash
docker-compose up -d
```

### Detener base de datos

```bash
docker-compose down
```

## 📚 Características Implementadas

### Autenticación y Autorización

- ✅ Registro de usuarios con hash de contraseñas (bcrypt)
- ✅ Login con JWT
- ✅ Protección de rutas con guards

### Gestión de Usuarios

- ✅ Obtener perfil del usuario autenticado
- ✅ Actualizar información del usuario
- ✅ Validación de datos

### Gestión de Publicaciones

- ✅ Crear publicaciones
- ✅ Listar todas las publicaciones
- ✅ Actualizar publicaciones propias
- ✅ Validación de permisos

## 📖 Documentación Adicional

Para información más detallada sobre cada módulo:

- [Backend README](./backend/README.md) - Arquitectura del backend, API endpoints, y más
- [Frontend README](./frontend/README.md) - Estructura del frontend, componentes, y más

## 👨‍💻 Autor

**DaniielDz**

## 📄 Licencia

Este proyecto fue desarrollado como parte de un desafío técnico para MindFactory.
