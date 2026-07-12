#!/bin/sh
set -eu

API_BASE_URL="${API_BASE_URL:-http://api:8080/api}"
ADMIN_NAME="${ADMIN_NAME:-Administrador}"

: "${ADMIN_EMAIL:?Falta ADMIN_EMAIL. Definelo en el archivo .env}"
: "${ADMIN_PASSWORD:?Falta ADMIN_PASSWORD. Definelo en el archivo .env}"

log() { printf '[seed] %s\n' "$1"; }

log "Esperando la API en ${API_BASE_URL} ..."
attempt=0
until curl -fsS "${API_BASE_URL}/propiedades" >/dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "${attempt}" -ge 60 ]; then
    log "La API no respondio a tiempo."
    exit 1
  fi
  sleep 2
done

existing=$(curl -fsS "${API_BASE_URL}/propiedades" | jq 'length')
if [ "${existing}" -ge 6 ]; then
  log "Ya hay ${existing} propiedades. No se vuelve a sembrar."
  exit 0
fi

log "Creando el usuario administrador ..."
status=$(curl -s -o /dev/null -w '%{http_code}' \
  -X POST "${API_BASE_URL}/usuarios" \
  -H 'Content-Type: application/json' \
  -d "$(jq -n --arg n "${ADMIN_NAME}" --arg c "${ADMIN_EMAIL}" --arg p "${ADMIN_PASSWORD}" \
        '{nombre:$n, correo:$c, contrasena:$p, rol:"administrador"}')")
log "POST /usuarios -> ${status}"

log "Iniciando sesion ..."
token=$(curl -fsS -X POST "${API_BASE_URL}/auth/login" \
  -H 'Content-Type: application/json' \
  -d "$(jq -n --arg c "${ADMIN_EMAIL}" --arg p "${ADMIN_PASSWORD}" '{correo:$c, contrasena:$p}')" \
  | jq -r '.token')

if [ -z "${token}" ] || [ "${token}" = "null" ]; then
  log "No se pudo obtener el token del administrador."
  exit 1
fi

crear_propiedad() {
  curl -fsS -X POST "${API_BASE_URL}/propiedades" \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${token}" \
    -d "$1" | jq -r '.id'
}

crear_solicitud() {
  curl -fsS -o /dev/null -X POST "${API_BASE_URL}/solicitudes" \
    -H 'Content-Type: application/json' \
    -d "$1"
}

log "Creando propiedades ..."
p1=$(crear_propiedad '{"titulo":"Apartamento moderno en Piantini","descripcion":"Tres habitaciones con acabados de lujo, a pasos de las principales plazas comerciales.","tipo":"venta","precio":18500000.00,"ubicacionZona":"Piantini","habitaciones":3,"banos":3,"parqueos":2,"fotoUrl":"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200"}')
p2=$(crear_propiedad '{"titulo":"Penthouse con terraza en Naco","descripcion":"Penthouse de dos niveles con terraza privada y vista despejada.","tipo":"venta","precio":27900000.00,"ubicacionZona":"Naco","habitaciones":4,"banos":4,"parqueos":3,"fotoUrl":"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200"}')
p3=$(crear_propiedad '{"titulo":"Estudio amueblado en Bella Vista","descripcion":"Ideal para profesionales. Incluye linea blanca y planta electrica.","tipo":"alquiler","precio":38000.00,"ubicacionZona":"Bella Vista","habitaciones":1,"banos":1,"parqueos":1,"fotoUrl":"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200"}')
p4=$(crear_propiedad '{"titulo":"Villa frente al mar en Punta Cana","descripcion":"Villa con piscina privada dentro de complejo cerrado con seguridad 24 horas.","tipo":"alquiler","precio":145000.00,"ubicacionZona":"Punta Cana","habitaciones":5,"banos":5,"parqueos":4,"fotoUrl":"https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200"}')
p5=$(crear_propiedad '{"titulo":"Casa familiar en Santiago","descripcion":"Dos plantas con patio, cerca de colegios y supermercados.","tipo":"venta","precio":9750000.00,"ubicacionZona":"Santiago","habitaciones":4,"banos":3,"parqueos":2,"fotoUrl":"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200"}')
p6=$(crear_propiedad '{"titulo":"Apartamento economico en Evaristo Morales","descripcion":"Listo para habitar en una zona de alta demanda.","tipo":"alquiler","precio":29500.00,"ubicacionZona":"Evaristo Morales","habitaciones":2,"banos":2,"parqueos":1,"fotoUrl":"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200"}')

log "Propiedades creadas: ${p1} ${p2} ${p3} ${p4} ${p5} ${p6}"

f1=$(date -u -d '+3 days' +%F)
f2=$(date -u -d '+5 days' +%F)
f3=$(date -u -d '+8 days' +%F)
f4=$(date -u -d '+10 days' +%F)

log "Creando solicitudes de visita ..."
crear_solicitud "$(jq -n --argjson id "${p1}" --arg f "${f1}" '{propiedadId:$id, nombreCompleto:"Laura Fernandez", correo:"laura.fernandez@ejemplo.com", telefono:"809-555-0101", fechaSugerida:$f, horario:"manana"}')"
crear_solicitud "$(jq -n --argjson id "${p1}" --arg f "${f2}" '{propiedadId:$id, nombreCompleto:"Laura Fernandez", correo:"laura.fernandez@ejemplo.com", telefono:"809-555-0101", fechaSugerida:$f, horario:"tarde"}')"
crear_solicitud "$(jq -n --argjson id "${p2}" --arg f "${f3}" '{propiedadId:$id, nombreCompleto:"Carlos Mejia", correo:"carlos.mejia@ejemplo.com", telefono:"809-555-0202", fechaSugerida:$f, horario:"tarde"}')"
crear_solicitud "$(jq -n --argjson id "${p3}" --arg f "${f4}" '{propiedadId:$id, nombreCompleto:"Ana Rodriguez", correo:"ana.rodriguez@ejemplo.com", telefono:"809-555-0303", fechaSugerida:$f, horario:"manana"}')"

log "Las propiedades ${p5} y ${p6} quedan sin solicitudes para poder probar la eliminacion."
log "Datos iniciales aplicados."
