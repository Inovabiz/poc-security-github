const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database(':memory:');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VULNERABLE 1: SQL Injection (CWE-089)
// Input del usuario concatenado directamente en la query SQL
app.get('/api/search', (req, res) => {
  const name = req.query.name;
  const query = "SELECT * FROM users WHERE name = '" + name + "'";
  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// VULNERABLE 2: Reflected XSS (CWE-079)
// Input del usuario insertado directamente en HTML sin sanitizar
app.get('/api/greet', (req, res) => {
  const name = req.query.name;
  res.send("<h1>Hola, " + name + "!</h1>");
});

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

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});