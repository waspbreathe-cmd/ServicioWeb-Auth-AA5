# Documentación de Servicios Web (API REST) - TEJOGEST PRO
**Evidencia:** GA7-220501096-AA5-EV03 - Diseño y desarrollo de servicios web - proyecto  
**Aprendiz:** Cristian Camilo Chaves Zamora  
**Programa:** Análisis y Desarrollo de Software (ADSO) - SENA  
**URL Base:** http://localhost:3000  
**Formato de intercambio:** JSON (Content-Type: application/json)  

---

## 1. Módulo de Autenticación

### 1.1. Iniciar Sesión
- **Endpoint:** `/api/auth/login`
- **Método:** `POST`
- **Descripción:** Valida las credenciales de acceso de un usuario registrado en el sistema.
- **Body (JSON):** `{"usuario": "admin", "password": "123"}`
- **Respuestas:**
  - `200 OK`: `{"mensaje": "Autenticación satisfactoria", "usuario": {"id": 1, "usuario": "admin", "rol": "Administrador"}}`
  - `401 Unauthorized`: `{"error": "Error en la autenticación: credenciales inválidas."}`

---

## 2. Módulo de Canchas

### 2.1. Listar Canchas
- **Endpoint:** `/api/canchas`
- **Método:** `GET`
- **Descripción:** Retorna el listado completo de canchas de tejo con su tarifa y estado actual.
- **Respuesta (`200 OK`):** Lista de canchas disponibles con su id, nombre, tipo, estado y tarifaHora.

### 2.2. Actualizar Estado de Cancha
- **Endpoint:** `/api/canchas/:id`
- **Método:** `PUT`
- **Descripción:** Modifica el estado operativo de una cancha específica (Disponible, Ocupada, Mantenimiento).
- **Body (JSON):** `{"estado": "Ocupada"}`
- **Respuestas:**
  - `200 OK`: `{"mensaje": "Estado de cancha actualizado correctamente.", "cancha": {"id": 1, "nombre": "Cancha 1 - Principal", "estado": "Ocupada"}}`
  - `404 Not Found`: `{"error": "Cancha no encontrada."}`

---

## 3. Módulo de Reservas

### 3.1. Consultar Reservas
- **Endpoint:** `/api/reservas`
- **Método:** `GET`
- **Descripción:** Obtiene todas las reservas activas registradas en TEJOGEST PRO.
- **Respuesta (`200 OK`):** Lista de reservas con datos del cliente, cancha asignada, fecha y hora.

### 3.2. Crear Reserva
- **Endpoint:** `/api/reservas`
- **Método:** `POST`
- **Descripción:** Registra una nueva reserva asociando un cliente a una cancha existente.
- **Body (JSON):** `{"cliente": "Juan Rodríguez", "telefono": "3001234567", "canchaId": 2, "fecha": "2026-11-26", "hora": "19:00"}`
- **Respuestas:**
  - `201 Created`: `{"mensaje": "Reserva registrada exitosamente.", "reserva": {"id": 2, "cliente": "Juan Rodríguez", "canchaId": 2, "fecha": "2026-11-26", "hora": "19:00", "estado": "Confirmada"}}`
  - `400 Bad Request`: `{"error": "Faltan campos obligatorios (cliente, canchaId, fecha, hora)."}`

### 3.3. Cancelar Reserva
- **Endpoint:** `/api/reservas/:id`
- **Método:** `DELETE`
- **Descripción:** Elimina una reserva del sistema según su identificador único (`id`).
- **Respuestas:**
  - `200 OK`: `{"mensaje": "Reserva cancelada correctamente.", "reserva": {"id": 1, "cliente": "Carlos Pérez"}}`
  - `404 Not Found`: `{"error": "Reserva no encontrada."}`
  