<<<<<<< HEAD
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
/backend    API RESTful y logica de negocio
/frontend   Interfaz de usuario y consumo del API
```

## Instalacion Local

### Backend
```
cd backend
[instrucciones de instalacion segun el stack elegido]
```

### Frontend
```
cd frontend
[instrucciones de instalacion segun el stack elegido]
```

## Variables de Entorno

Ver `.env.example` en cada carpeta para las variables requeridas (conexion a base de datos, clave de autenticacion, URL del API, etc.).

## Despliegue

- API en produccion: [URL del backend]
- Sitio en produccion: [URL del frontend]

## Funcionalidades Principales

- Autenticacion y control de acceso por roles (Administrador / Cliente)
- CRUD de propiedades
- Catalogo publico con filtros por tipo, ubicacion y precio
- Solicitud y gestion de visitas
- Gestion de usuarios y permisos
- Registro de auditoria
- Modulo de reportes (distribucion de inmuebles y propiedades mas solicitadas)
>>>>>>> main
