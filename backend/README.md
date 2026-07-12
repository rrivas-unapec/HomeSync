# UrbanSync API — Sistema de Gestión Inmobiliaria

Backend en **.NET 8 / ASP.NET Core Web API** con arquitectura en capas, siguiendo
la estructura de solución que ya tenías creada en Visual Studio:

```
UrbanSync.Api           -> Controllers, Program.cs, JWT, Swagger, appsettings
UrbanSync.Business       -> DTOs, servicios de negocio, JWT service, hashing (BCrypt)
UrbanSync.DataAccess      -> DbContext (EF Core Database First), configuraciones Fluent API, repositorios
UrbanSync.Domain          -> Entidades y constantes de dominio (sin dependencias externas)
```

## 1. Cómo integrarlo a tu solución

Tienes dos opciones:

**Opción A — reemplazar tus proyectos vacíos (recomendado):**
Copia el contenido de cada carpeta (`UrbanSync.Api`, `UrbanSync.Business`,
`UrbanSync.DataAccess`, `UrbanSync.Domain`) dentro de las carpetas de tus
proyectos existentes en la solución `UrbanSync`, reemplazando los `.csproj`
y agregando todos los archivos `.cs`. Luego, en Visual Studio: **Mostrar todos
los archivos** → click derecho en cada carpeta → **Incluir en el proyecto**.

**Opción B — usar esta carpeta como solución independiente:**
Abre `UrbanSync.sln` directamente (la generé junto a los proyectos) y trabaja
desde aquí; luego puedes mover/renombrar según prefieras.

## 2. Requisitos previos

- .NET 8 SDK
- SQL Server (local, LocalDB o remoto) con la base `HomeSync` ya creada con tu
  script `HomeSync.sql`
- Visual Studio 2022 (17.8+) o `dotnet` CLI

## 3. Configurar la conexión y el JWT

Edita `UrbanSync.Api/appsettings.json`:

```json
"ConnectionStrings": {
  "HomeSyncConnection": "Server=TU_SERVIDOR;Database=HomeSync;Trusted_Connection=True;TrustServerCertificate=True;"
},
"Jwt": {
  "Key": "una-llave-secreta-de-al-menos-32-caracteres",
  ...
}
```

> ⚠️ No subas `appsettings.json` con secretos reales a GitHub. Usa
> `dotnet user-secrets` en desarrollo o variables de entorno en producción,
> y crea un `.env.example` como pide el enunciado del proyecto.

## 4. Ejecutar

```bash
cd UrbanSync.Api
dotnet restore
dotnet run
```

Swagger queda disponible en `https://localhost:PUERTO/swagger` (solo en
entorno Development). Desde ahí puedes:

1. `POST /api/usuarios` — crear el primer usuario con `rol: "administrador"`.
2. `POST /api/auth/login` — obtener el token JWT.
3. Botón **Authorize** en Swagger → pegar `Bearer {token}` para probar los
   endpoints protegidos (crear/editar/eliminar propiedades, reportes, etc.)

## 5. Qué cubre este esqueleto respecto al enunciado

| Requisito del documento | Dónde está |
|---|---|
| Entidades: Usuario, Cliente, Propiedad, SolicitudDeVisita | `UrbanSync.Domain/Entities` |
| Mínimo 3 endpoints REST por entidad | `UrbanSync.Api/Controllers` (ver tabla abajo) |
| Roles y permisos (administrador/cliente) | JWT + `[Authorize(Roles = ...)]` |
| Auditoría (creación/edición/eliminación) | `PropiedadService` inserta en `AuditoriaPropiedades` en cada operación |
| Reportes (distribución por tipo, top 5 solicitadas) | `ReportesController` + `ReporteService` |
| Validación de entradas / manejo de errores HTTP | `ExceptionMiddleware` + excepciones de negocio |
| Seguridad (hash de contraseña) | BCrypt en `UsuarioService` |

### Endpoints implementados

- **Auth**: `POST /api/auth/login`
- **Usuarios**: `POST /api/usuarios`, `GET /api/usuarios/{id}`
- **Propiedades**: `GET /api/propiedades` (con filtros `tipo`, `zona`, `precioMinimo`, `precioMaximo`), `GET /api/propiedades/{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` (los 3 últimos solo administrador)
- **Clientes**: `GET /api/clientes`, `POST /api/clientes`, `PUT /api/clientes/{id}` (solo administrador)
- **Solicitudes**: `GET /api/solicitudes` (admin), `POST /api/solicitudes` (público, catálogo), `PATCH /api/solicitudes/{id}` (admin), `DELETE /api/solicitudes/{id}` (admin)
- **Reportes**: `GET /api/reportes/distribucion-tipo`, `GET /api/reportes/top-solicitadas` (ambos solo administrador)
