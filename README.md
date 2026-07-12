# Sistema de Gestion Inmobiliaria - Catalogo de Alquiler y Venta

Aplicacion web para la gestion de un catalogo de propiedades inmobiliarias (alquiler y venta), compuesta por un backend con API RESTful y un frontend que consume dichos servicios. Permite a un administrador gestionar el inventario de propiedades, usuarios y solicitudes de visita, mientras que el cliente final puede explorar el catalogo publico, filtrar resultados y agendar visitas. Incluye un modulo de reportes de inteligencia de negocio y registro de auditoria.

Proyecto desarrollado para la asignatura Programacion y Tecnologia Open Source 1, UNAPEC (Mayo - Agosto 2026).

## Equipo de Desarrollo - UNAPEC

| Nombre | Matricula |
|---|---|
| David Rivas | A00117072 |
| Romer Amparo | A00118532 |
| Elwins Zorrilla | A00118365 |
| Carlos Rodriguez | A00116172 |
| Renny Placencio | A00119098 |

## Estructura del Repositorio

```
backend/    API RESTful en .NET 8 (4 capas) + esquema SQL
frontend/   SPA en React 18 + TypeScript
scripts/    Datos iniciales
docker-compose.yml
```

## Funcionalidades Principales

- Autenticacion y control de acceso por roles (Administrador / Cliente)
- CRUD de propiedades
- Catalogo publico con filtros por tipo, ubicacion y precio
- Solicitud y gestion de visitas
- Gestion de usuarios y clientes
- Registro de auditoria
- Modulo de reportes (distribucion de inmuebles y propiedades mas solicitadas)

---

## Levantar el proyecto

### Requisitos

- Docker Desktop con WSL2, con **al menos 4 GB de memoria** asignados (SQL Server los necesita).
- Puertos libres: `3000` (web) y `8081` (API). El `1433` de la base de datos solo se publica en `127.0.0.1`. Todos se pueden cambiar en el `.env`.

### Arranque

```bash
cp .env.example .env
# Edita .env y define las claves (el archivo solo trae marcadores de posicion)
docker compose up --build -d
```

El arranque completo tarda 1–2 minutos la primera vez, porque SQL Server tarda en quedar `healthy`. Verifica con `docker compose ps`.

| Servicio | URL |
|---|---|
| Aplicacion web | http://localhost:3000 |
| API | http://localhost:8081/api |
| Swagger | http://localhost:8081/swagger |

### Credenciales

El servicio `seed` crea el administrador y los datos de ejemplo (6 propiedades, 4 solicitudes) usando la propia API. El correo y la contrasena son los que definas en `ADMIN_EMAIL` y `ADMIN_PASSWORD` dentro del `.env`; el seed **falla si no los defines**, para no dejar credenciales por defecto.

Para empezar de cero: `docker compose down -v && docker compose up -d`.

---

## Desarrollo

### Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint     # eslint + prettier + verificacion de que no haya comentarios
npm run test
```

Copia `frontend/.env.example` a `frontend/.env` y apunta `VITE_API_BASE_URL` a tu API.

### Backend

```bash
dotnet build backend/HomeSync.sln
dotnet run --project backend/HomeSync.Api --launch-profile http
```

Usa el perfil `http`. Con el perfil `https`, `UseHttpsRedirection()` redirige a `https://localhost:7261` y el frontend no podra conectarse.

### Base de datos

El esquema esta en `backend/db/init/01-schema.sql` (T-SQL, idempotente) y el usuario de aplicacion con privilegios minimos en `02-app-user.sql`. Docker los aplica solo.

Si ya tienes una base `HomeSync` creada con el script original, aplica la migracion:

```
backend/db/migrations/01-ampliar-accion-auditoria.sql
```

Sin ella, **eliminar una propiedad falla** (ver «Defectos conocidos», punto 1).

---

## Arquitectura

### Backend

Cuatro capas: `HomeSync.Api` (controladores) → `HomeSync.Business` (servicios, DTOs) → `HomeSync.DataAccess` (EF Core, repositorios) → `HomeSync.Domain` (entidades).

Autenticacion por **JWT Bearer** (sin cookies, sin refresh token). Contrasenas con BCrypt. Es *Database First*: no hay migraciones de EF, el esquema se mantiene a mano.

En Docker la API **no se conecta como `sa`**, sino con `homesync_app`, un usuario limitado a lectura y escritura de datos (no puede hacer DDL ni escalar privilegios).

### Frontend

```
src/
  app/         providers (auth, query), router (rutas y guards), config
  components/  ui (primitivos), shared (layout, estados, paginas de estado)
  features/    auth, properties, visit-requests, clients, users, audit, reports
               cada una con api/ components/ hooks/ pages/ schemas/ types/
  lib/         http-client, api-error, messages, domain, format, query-keys
  test/        setup, MSW, factories, helper de render
```

Decisiones que conviene conocer:

- **Toda la capa HTTP vive en `lib/http-client.ts`.** Ningun componente importa Axios; ESLint lo impide.
- **`lib/auth-events.ts` rompe el ciclo** entre el interceptor de Axios y el `AuthProvider` de React: el interceptor emite un evento, el provider lo escucha.
- **Los filtros, la pagina y el orden del catalogo viven en la URL**, asi que recargar o compartir un enlace conserva el estado.
- **Los textos visibles salen de `lib/messages.ts`.** No hay cadenas sueltas en el JSX.
- **Sin comentarios en el codigo.** `frontend/scripts/check-no-comments.mjs` lo verifica en cada `npm run lint`.

---

## Defectos conocidos del API

Encontrados al integrar. Los tres primeros estan **corregidos**; el resto se maneja desde el frontend y se documenta aqui porque afecta a cualquier cliente del API.

### Corregidos

1. **`auditoriapropiedades.accion` era `VARCHAR(10)`, pero su propio `CHECK` admite `'ELIMINACION'` (11 caracteres).**
   El backend borra la propiedad y *despues* inserta la auditoria, asi que al eliminar: la fila desaparecia y el API devolvia 500.
   Corregido en los tres sitios: el esquema, una migracion para bases existentes, y `HasMaxLength(15)` en la configuracion de EF.

2. **La bitacora de auditoria no mostraba las eliminaciones.**
   `PropiedadId` es `int` no nulo y `IsRequired()`, asi que EF trataba la relacion como obligatoria y `.Include(a => a.Propiedad)` generaba un `INNER JOIN`, descartando justo las filas cuya propiedad ya no existe — lo mas importante que debe registrar una auditoria. Ahora las propiedades se resuelven aparte y las filas huerfanas se conservan, rotuladas como «Propiedad eliminada».

3. **`POST /api/clientes` y `POST /api/solicitudes` devolvian un `Location` roto** (`api/clientes/5` sin barra inicial, resolviendo a `/api/api/clientes/5`, y apuntando a rutas que no existian). Se anadieron los `GET` por id y se usa `CreatedAtAction`.

### Vigentes (manejados desde el frontend)

4. **El API no valida nada.** Los DTOs se autoinicializan (`string.Empty`, `0`), asi que un campo faltante **no da error**: se inserta basura y responde **201**. El 500 solo aparece al exceder las longitudes del DB.
   → **Zod en el cliente es la unica validacion real del sistema.** Replica todos los limites de la base de datos.

5. **`DELETE /api/propiedades/{id}` devuelve 500 si la propiedad tiene solicitudes de visita** (la FK es real y `NO ACTION`).
   → La UI lo detecta, lo explica y ofrece **«marcar como inactiva»** como alternativa. Ademas refresca la lista aunque el borrado falle, porque un 500 es ambiguo: puede significar que no se borro (FK) o que si se borro (fallo posterior de auditoria).

6. **El catalogo publico expone propiedades `inactiva` y `reservada`**; `GET /api/propiedades` no acepta filtro por estado.
   → Las inactivas se filtran en el cliente; las reservadas se muestran con distintivo y sin poder agendar.

7. **No hay paginacion ni ordenamiento en el servidor.** Se hacen en el cliente sobre el arreglo completo. **No escala.**

8. **No hay carga de archivos.** `fotoUrl` es una URL de hasta 500 caracteres.

9. **No hay refresh token ni endpoint `/me`.** La sesion se restaura desde `localStorage` (justificado: el API usa Bearer, no cookies HTTP-only) y se cierra al expirar o ante un 401.

10. **Los reportes no aceptan filtros** (ni fecha, ni zona, ni tipo).

11. **`POST /api/solicitudes` con un correo ya registrado reutiliza el cliente e ignora el nombre y el telefono nuevos.** La UI avisa de esto en vez de prometer que actualizo los datos.

### Hallazgos de seguridad del backend (no corregidos)

Se reportan sin tocarlos, porque cambiarlos altera el comportamiento del API:

- **`POST /api/usuarios` es publico y acepta `rol` arbitrario**: cualquiera puede registrarse como administrador. El formulario de registro envia `rol: "cliente"` fijo desde el codigo, pero **eso no protege el endpoint**.
  Nota: el `seed` depende de este agujero para crear el administrador inicial. Si se cierra, hay que sembrar de otra forma.
- **`GET /api/usuarios/{id}` es `[Authorize]` a secas**: un usuario con rol `cliente` puede leer el perfil de cualquier otro (IDOR).
- **`appsettings.json` versiona la `Jwt:Key` y una cadena de conexion en claro.** En Docker se sobrescriben por variables de entorno, pero **la clave del repositorio debe rotarse**: esta publicada.
- **`POST /api/auth/login` no tiene limitacion de intentos** ni bloqueo de cuenta.
- **No hay politica de contrasenas en el servidor**: se pueden crear cuentas con contrasena vacia.

---

## Limitaciones

- **Sin modo oscuro.** El diseno define los tokens, pero nunca activa la clase `dark` ni incluye un conmutador. Los colores son semanticos, asi que anadirlo despues es aditivo.
- **La auditoria es de solo lectura** y solo cubre propiedades: es lo unico que el backend registra.
