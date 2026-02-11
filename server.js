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

// ⚠️ CÓDIGO CON PROBLEMAS INTENCIONALES PARA CODEQL ⚠️

// Problema 1: SQL Injection vulnerability
app.get('/api/search', (req, res) => {
  const searchTerm = req.query.q;
  // CodeQL detectará: concatenación directa de input del usuario en SQL
  const query = "SELECT * FROM users WHERE name = '" + searchTerm + "'";
  res.json({ query, warning: 'SQL Injection vulnerability' });
});

// Problema 2: Path Traversal vulnerability
const fs = require('fs');
app.get('/api/file', (req, res) => {
  const filename = req.query.name;
  // CodeQL detectará: acceso a archivos sin validación
  const filePath = './uploads/' + filename;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'File not found' });
    res.send(data);
  });
});

// Problema 3: Command Injection vulnerability
const { exec } = require('child_process');
app.get('/api/ping', (req, res) => {
  const host = req.query.host;
  // CodeQL detectará: ejecución de comandos con input no sanitizado
  exec('ping ' + host, (error, stdout) => {
    res.json({ result: stdout });
  });
});

// Problema 4: Credenciales hardcodeadas
const API_KEY = 'sk-1234567890abcdef';  // CodeQL detectará esto
const DB_PASSWORD = 'admin123';          // CodeQL detectará esto

// Problema 5: Comparación insegura de contraseñas
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  // CodeQL detectará: comparación de contraseña sin hash
  if (password == DB_PASSWORD) {
    res.json({ token: API_KEY });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Problema 6: eval() con input del usuario
app.post('/api/calculate', (req, res) => {
  const expression = req.body.expression;
  // CodeQL detectará: uso peligroso de eval()
  const result = eval(expression);
  res.json({ result });
});

// Problema 7: Missing input validation
app.post('/api/update-profile', (req, res) => {
  const userData = req.body;
  // CodeQL detectará: falta de validación de input
  res.json({ updated: true, data: userData });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
