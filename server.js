const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
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

// VULNERABILIDAD 1: Command Injection - ejecuta comandos sin sanitizar
app.get('/api/ping', (req, res) => {
  const host = req.query.host;
  // Sin validación del input del usuario
  exec(`ping -n 4 ${host}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ output: stdout });
  });
});

// VULNERABILIDAD 2: Path Traversal - acceso a archivos sin validación
app.get('/api/file', (req, res) => {
  const filename = req.query.name;
  // Sin sanitizar el path, permite acceder a cualquier archivo
  const filePath = path.join(__dirname, 'data', filename);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    res.json({ content: data });
  });
});

// VULNERABILIDAD 3: Code Injection con eval() - ejecuta código arbitrario
app.post('/api/calculate', (req, res) => {
  const { expression } = req.body;
  try {
    // eval() es extremadamente peligroso con input del usuario
    const result = eval(expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Expresión inválida' });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
