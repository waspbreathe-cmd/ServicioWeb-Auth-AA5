/**
 * Servicio Web REST - Registro e Inicio de Sesión (GA7-220501096-AA5-EV01)
 * Aprendiz: Cristian Camilo Chaves Zamora | SENA ADSO - Ficha 3336095
 * Descripción: API desarrollada en Node.js y Express que gestiona el registro
 * de usuarios y valida credenciales de inicio de sesión retornando mensajes
 * de autenticación satisfactoria o error en la autenticación.
 */

const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para interpretar cuerpos de petición en formato JSON
app.use(express.json());

// Almacenamiento en memoria con un usuario base precargado para pruebas inmediatas
const usuariosRegistrados = [
  {
    id: 1,
    usuario: "cristian.chaves",
    contrasena: "Tejo2026*",
    nombreCompleto: "Cristian Camilo Chaves Zamora",
    rol: "Administrador",
  },
];

/**
 * Endpoint GET /
 * Verifica el estado operativo del servicio web y lista las rutas disponibles.
 */
app.get("/", (req, res) => {
  res.status(200).json({
    servicio: "API de Autenticación - Caso GA7-220501096-AA5-EV01",
    estado: "Activo",
    endpoints: {
      registro: "POST /api/auth/registro",
      login: "POST /api/auth/login",
      listarUsuarios: "GET /api/auth/usuarios",
    },
  });
});

/**
 * Endpoint POST /api/auth/registro
 * Recibe usuario, contrasena y nombreCompleto en el cuerpo JSON.
 * Valida que los datos obligatorios existan y que el usuario no esté duplicado.
 */
app.post("/api/auth/registro", (req, res) => {
  const { usuario, contrasena, nombreCompleto } = req.body;

  // Validación de campos obligatorios
  if (!usuario || !contrasena) {
    return res.status(400).json({
      exito: false,
      mensaje: "Error en el registro: debe enviar usuario y contraseña.",
    });
  }

  // Verificación de duplicidad de nombre de usuario
  const usuarioExistente = usuariosRegistrados.find(
    (item) => item.usuario.toLowerCase() === usuario.trim().toLowerCase()
  );

  if (usuarioExistente) {
    return res.status(409).json({
      exito: false,
      mensaje: "Error en el registro: el nombre de usuario ya se encuentra registrado.",
    });
  }

  // Creación del nuevo registro
  const nuevoUsuario = {
    id: usuariosRegistrados.length + 1,
    usuario: usuario.trim(),
    contrasena: contrasena.trim(),
    nombreCompleto: nombreCompleto ? nombreCompleto.trim() : "Usuario Registrado",
    rol: "Operador",
  };

  usuariosRegistrados.push(nuevoUsuario);

  return res.status(201).json({
    exito: true,
    mensaje: "Registro de usuario satisfactorio.",
    datos: {
      id: nuevoUsuario.id,
      usuario: nuevoUsuario.usuario,
      nombreCompleto: nuevoUsuario.nombreCompleto,
      rol: nuevoUsuario.rol,
    },
  });
});

/**
 * Endpoint POST /api/auth/login
 * Recibe usuario y contrasena; valida coincidencia contra los usuarios registrados.
 * Responde con autenticación satisfactoria (HTTP 200) o error en la autenticación (HTTP 401).
 */
app.post("/api/auth/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  // Validación de presencia de credenciales
  if (!usuario || !contrasena) {
    return res.status(400).json({
      autenticado: false,
      mensaje: "Error en la autenticación: debe ingresar usuario y contraseña.",
    });
  }

  // Búsqueda y verificación exacta de credenciales
  const usuarioValido = usuariosRegistrados.find(
    (item) =>
      item.usuario === usuario.trim() && item.contrasena === contrasena.trim()
  );

  if (!usuarioValido) {
    return res.status(401).json({
      autenticado: false,
      mensaje: "Error en la autenticación: usuario o contraseña incorrectos.",
    });
  }

  return res.status(200).json({
    autenticado: true,
    mensaje: "Autenticación satisfactoria.",
    usuario: {
      id: usuarioValido.id,
      usuario: usuarioValido.usuario,
      nombreCompleto: usuarioValido.nombreCompleto,
      rol: usuarioValido.rol,
    },
  });
});

/**
 * Endpoint GET /api/auth/usuarios
 * Permite consultar los usuarios registrados (sin exponer contraseñas).
 */
app.get("/api/auth/usuarios", (req, res) => {
  const listadoSeguro = usuariosRegistrados.map(({ id, usuario, nombreCompleto, rol }) => ({
    id,
    usuario,
    nombreCompleto,
    rol,
  }));

  res.status(200).json({
    total: listadoSeguro.length,
    usuarios: listadoSeguro,
  });
});

// Inicialización del servidor HTTP
app.listen(PORT, () => {
  console.log(`Servidor de autenticación ejecutándose en http://localhost:${PORT}`);
});
