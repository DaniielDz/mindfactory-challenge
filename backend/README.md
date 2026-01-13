# Backend - MindFactory Challenge

API REST desarrollada con **NestJS** para el sistema de gestión de usuarios y publicaciones. Implementa autenticación JWT, validación de datos, y ORM con Prisma.

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js + TypeScript)
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens) + Passport
- **Validación**: class-validator + class-transformer
- **Hash de Contraseñas**: bcrypt
- **Testing**: Jest

## 📂 Estructura del Proyecto

```text
backend/
├── src/
│ ├── auth/ # Módulo de autenticación
│ │ ├── dto/ # DTOs de autenticación (register, login)
│ │ ├── guards/ # Guards de autenticación (JWT)
│ │ ├── interfaces/ # Interfaces (RequestWithUser)
│ │ ├── strategies/ # Estrategias de Passport (JWT)
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ ├── auth.service.spec.ts
│ │ └── auth.module.ts
│ ├── users/ # Módulo de usuarios
│ │ ├── dto/ # DTOs (update-user)
│ │ ├── users.controller.ts
│ │ ├── users.service.ts
│ │ ├── users.service.spec.ts
│ │ └── users.module.ts
│ ├── posts/ # Módulo de publicaciones
│ │ ├── dto/ # DTOs (create-post, update-post)
│ │ ├── posts.controller.ts
│ │ ├── posts.service.ts
│ │ ├── posts.service.spec.ts
│ │ └── posts.module.ts
│ ├── prisma/ # Servicio de Prisma
│ │ ├── prisma.service.ts
│ │ └── prisma.module.ts
│ ├── app.controller.ts # Controller principal
│ ├── app.service.ts # Service principal
│ ├── app.module.ts # Módulo principal
│ └── main.ts # Punto de entrada
├── prisma/
│ └── schema.prisma # Esquema de base de datos
├── test/ # Tests E2E
│ ├── app.e2e-spec.ts
│ └── jest-e2e.json
└── generated/ # Cliente Prisma generado (custom output)
  └── prisma/ # Cliente Prisma (configurado en schema.prisma)
```

## 📥 Instalación

### 1. Instalar dependencias

```bash
cd backend
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mindfactory_db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Iniciar la base de datos

Desde la raíz del proyecto:

```bash
docker-compose up -d
```

## 🗄️ Variables de Entorno

| Variable       | Descripción                     | Valor por defecto | Requerida |
| -------------- | ------------------------------- | ----------------- | --------- |
| `DATABASE_URL` | Connection string de PostgreSQL | -                 | ✅        |
| `PORT`         | Puerto del servidor             | 3000              | ❌        |
| `NODE_ENV`     | Entorno de ejecución            | development       | ❌        |
| `JWT_SECRET`   | Secreto para firmar tokens JWT  | -                 | ✅        |

## 🔄 Migraciones de Base de Datos

### Generar cliente Prisma

Esto genera el cliente de Prisma basado en el schema:

```bash
pnpm prisma generate
```

### Aplicar migraciones en desarrollo

```bash
pnpm prisma migrate dev
```

Este comando:

1. Crea una nueva migración si hay cambios en el schema
2. Aplica las migraciones pendientes
3. Genera el cliente Prisma

### Aplicar migraciones en producción

```bash
pnpm prisma migrate deploy
```

### Crear una nueva migración

Después de modificar `prisma/schema.prisma`:

```bash
pnpm prisma migrate dev --name nombre_descriptivo
```

### Resetear la base de datos

```bash
pnpm prisma migrate reset
```

### Abrir Prisma Studio

Interfaz visual para explorar y editar la base de datos:

```bash
pnpm prisma studio
```

## 📜 Scripts Disponibles

### Desarrollo

```bash
pnpm start:dev          # Inicia el servidor en modo desarrollo (watch mode)
pnpm start:debug        # Inicia con debugger
```

### Producción

```bash
pnpm build              # Compila el proyecto
pnpm start:prod         # Ejecuta la versión compilada
```

### Testing

```bash
pnpm test               # Ejecuta tests unitarios
pnpm test:watch         # Tests en modo watch
pnpm test:cov           # Tests con cobertura
pnpm test:e2e           # Tests end-to-end
```

### Linting y Formato

```bash
pnpm lint               # Ejecuta ESLint
pnpm format             # Formatea código con Prettier
```

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint         | Descripción             | Auth |
| ------ | ---------------- | ----------------------- | ---- |
| POST   | `/auth/register` | Registrar nuevo usuario | ❌   |
| POST   | `/auth/login`    | Iniciar sesión          | ❌   |

### Usuarios

| Método | Endpoint     | Descripción                | Auth |
| ------ | ------------ | -------------------------- | ---- |
| GET    | `/users/:id` | Obtener perfil del usuario | ❌   |
| PUT    | `/users/:id` | Actualizar perfil          | ✅   |

### Publicaciones

| Método | Endpoint     | Descripción                         | Auth |
| ------ | ------------ | ----------------------------------- | ---- |
| GET    | `/posts`     | Listar todas las publicaciones      | ❌   |
| POST   | `/posts`     | Crear publicación                   | ✅   |
| GET    | `/posts/:id` | Obtener publicación por ID          | ❌   |
| PUT    | `/posts/:id` | Actualizar publicación (solo autor) | ✅   |

## 🧪 Testing

### Estructura de Tests

- **Tests Unitarios**: `src/**/*.spec.ts`
- **Tests E2E**: `test/**/*.e2e-spec.ts`

### Ejecutar Tests

```bash
# Tests unitarios
pnpm test

# Tests E2E
pnpm test:e2e

# Cobertura
pnpm test:cov
```

### Configuración de Tests E2E

Los tests E2E requieren una base de datos de test. Puedes configurar una conexión separada en `.env.test`.

## 🏗️ Arquitectura

### Patrón de Diseño

El backend sigue la arquitectura modular de NestJS:

- **Controllers**: Manejan las peticiones HTTP
- **Services**: Contienen la lógica de negocio
- **Modules**: Organizan la aplicación en funcionalidades
- **DTOs**: Validan y transforman datos de entrada
- **Guards**: Protegen rutas y validan autenticación

### Validación

Se utiliza `class-validator` con pipes globales para validar automáticamente todos los DTOs.

### Autenticación

- **Estrategia**: JWT con Passport
- **Storage**: Los tokens JWT se almacenan en cookies HTTP-only y se extraen mediante un extractor personalizado en `JwtStrategy`
- **Expiración**: 1 hora (configurado en `auth.module.ts` y en las cookies)
- **Hash**: bcrypt con 10 salt rounds
- **Cookie Security**: HTTP-only, Secure en producción, SameSite strict

### Base de Datos

- **ORM**: Prisma
- **Migraciones**: Automáticas con Prisma Migrate
- **Validación**: A nivel de schema y a nivel de aplicación

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT firmados
- ✅ Cookies HTTP-only y Secure (en producción)
- ✅ CORS configurado
- ✅ Validación de datos con class-validator
- ✅ Guards de autenticación en rutas protegidas
- ✅ Validación de permisos (usuarios solo pueden modificar sus propias publicaciones)

## 👨‍💻 Autor

**DaniielDz**
