const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a la API!',
    status: 'OK'
  });
});

// Rutas de ejemplo
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Usuario 1', email: 'user1@example.com' },
    { id: 2, name: 'Usuario 2', email: 'user2@example.com' },
    { id: 3, name: 'Usuario 3', email: 'user3@example.com' }
  ];
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = { id, name: `Usuario ${id}`, email: `user${id}@example.com` };
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: Date.now(),
    name,
    email
  };
  res.status(201).json(newUser);
});

// ================================================================================
// ⚠️ CÓDIGO CON PROBLEMAS INTENCIONALES PARA GITHUB ADVANCED SECURITY (CodeQL) ⚠️
// ================================================================================
// Este código contiene 1 vulnerabilidad intencional que será detectada
// por CodeQL durante el análisis del Pull Request.
// ADVERTENCIA: Este código es solo para demostración - NO usar en producción.
// ================================================================================

// --------------------------------------------------------------------------------
// PROBLEMA #1: Prototype Pollution (CWE-1321)
// --------------------------------------------------------------------------------
// ¿Qué detectará CodeQL?
// - Modificación no controlada de propiedades de objetos usando input del usuario
// - Riesgo: Un atacante puede contaminar el prototipo de Object y afectar toda la app
// Severidad esperada: HIGH/MEDIUM
// Ejemplo de ataque: {"__proto__": {"isAdmin": true}}
//                    {"constructor": {"prototype": {"polluted": "yes"}}}
app.post('/api/merge-config', (req, res) => {
  const defaultConfig = { theme: 'light', language: 'es' };
  const userConfig = req.body;

  // ⚠️ VULNERABILIDAD: Merge recursivo sin protección contra __proto__
  // Permite que el usuario inyecte propiedades en Object.prototype
  function deepMerge(target, source) {
    for (let key in source) {
      if (source[key] && typeof source[key] === 'object') {
        target[key] = target[key] || {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  const finalConfig = deepMerge(defaultConfig, userConfig);
  res.json({ config: finalConfig, message: 'Configuration merged' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
