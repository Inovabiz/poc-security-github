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
  console.log(users);
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
// Este código contiene 3 vulnerabilidades intencionales que serán detectadas
// por CodeQL durante el análisis del Pull Request.
// ADVERTENCIA: Este código es solo para demostración - NO usar en producción.
// ================================================================================

// --------------------------------------------------------------------------------
// PROBLEMA #1: SQL Injection (CWE-89)
// --------------------------------------------------------------------------------
// ¿Qué detectará CodeQL?
// - Concatenación directa de input del usuario en una consulta SQL
// - Riesgo: Un atacante puede inyectar código SQL malicioso
// Severidad esperada: CRITICAL/HIGH
// Ejemplo de ataque: ?q=' OR '1'='1
app.get('/api/search', (req, res) => {
  const searchTerm = req.query.q;
  // ⚠️ VULNERABILIDAD: Sin sanitización ni prepared statements
  const query = "SELECT * FROM users WHERE name = '" + searchTerm + "'";
  res.json({ query, warning: 'SQL Injection vulnerability' });
});



// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
