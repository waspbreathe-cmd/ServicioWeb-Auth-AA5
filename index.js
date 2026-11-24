/**
 * Proyecto Formativo: TEJOGEST PRO - Sistema de Gestión de Canchas de Tejo
 * Evidencia: GA7-220501096-AA5-EV03 - Diseño y desarrollo de servicios web - proyecto
 * Aprendiz: Cristian Camilo Chaves Zamora
 */

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para interpretar peticiones en formato JSON
app.use(express.json());

// ==========================================
// DATOS EN MEMORIA (Simulación de Base de Datos)
// ==========================================
let usuarios = [
    { id: 1, usuario: 'admin', password: '123', rol: 'Administrador' }
];

let canchas = [
    { id: 1, nombre: 'Cancha 1 - Principal', tipo: 'Tejo Tradicional', estado: 'Disponible', tarifaHora: 25000 },
    { id: 2, nombre: 'Cancha 2 - Cubierta', tipo: 'Mini Tejo', estado: 'Disponible', tarifaHora: 20000 }
];

let reservas = [
    { id: 1, cliente: 'Carlos Pérez', telefono: '3105551234', canchaId: 1, fecha: '2026-11-25', hora: '18:00', estado: 'Confirmada' }
];

// ==========================================
// 1. SERVICIO DE AUTENTICACIÓN (Inicio de sesión)
// ==========================================
app.post('/api/auth/login', (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: 'Debe enviar usuario y contraseña.' });
    }

    const userFound = usuarios.find(u => u.usuario === usuario && u.password === password);
    if (!userFound) {
        return res.status(401).json({ error: 'Error en la autenticación: credenciales inválidas.' });
    }

    res.status(200).json({
        mensaje: 'Autenticación satisfactoria',
        usuario: { id: userFound.id, usuario: userFound.usuario, rol: userFound.rol }
    });
});

// ==========================================
// 2. SERVICIO DE GESTIÓN DE CANCHAS
// ==========================================
// Consultar todas las canchas
app.get('/api/canchas', (req, res) => {
    res.status(200).json({ total: canchas.length, canchas });
});

// Actualizar estado de una cancha (Disponible / Ocupada / Mantenimiento)
app.put('/api/canchas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { estado } = req.body;
    const cancha = canchas.find(c => c.id === id);

    if (!cancha) {
        return res.status(404).json({ error: 'Cancha no encontrada.' });
    }

    cancha.estado = estado || cancha.estado;
    res.status(200).json({ mensaje: 'Estado de cancha actualizado correctamente.', cancha });
});

// ==========================================
// 3. SERVICIO DE GESTIÓN DE RESERVAS
// ==========================================
// Listar todas las reservas
app.get('/api/reservas', (req, res) => {
    res.status(200).json({ total: reservas.length, reservas });
});

// Crear una nueva reserva
app.post('/api/reservas', (req, res) => {
    const { cliente, telefono, canchaId, fecha, hora } = req.body;

    if (!cliente || !canchaId || !fecha || !hora) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (cliente, canchaId, fecha, hora).' });
    }

    const canchaExiste = canchas.find(c => c.id === parseInt(canchaId));
    if (!canchaExiste) {
        return res.status(404).json({ error: 'La cancha seleccionada no existe.' });
    }

    const nuevaReserva = {
        id: reservas.length + 1,
        cliente,
        telefono: telefono || 'Sin teléfono',
        canchaId: parseInt(canchaId),
        fecha,
        hora,
        estado: 'Confirmada'
    };

    reservas.push(nuevaReserva);
    res.status(201).json({ mensaje: 'Reserva registrada exitosamente.', reserva: nuevaReserva });
});

// Cancelar / eliminar una reserva
app.delete('/api/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = reservas.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Reserva no encontrada.' });
    }

    const eliminada = reservas.splice(index, 1);
    res.status(200).json({ mensaje: 'Reserva cancelada correctamente.', reserva: eliminada[0] });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor TEJOGEST PRO corriendo en http://localhost:${PORT}`);
});
