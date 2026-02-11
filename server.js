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

// --------------------------------------------------------------------------------
// PROBLEMA #2: Command Injection (CWE-78)
// --------------------------------------------------------------------------------
// ¿Qué detectará CodeQL?
// - Ejecución de comandos del sistema con input no sanitizado
// - Riesgo: Un atacante puede ejecutar comandos arbitrarios en el servidor
// Severidad esperada: CRITICAL/HIGH
// Ejemplo de ataque: ?host=8.8.8.8; rm -rf /
const { exec } = require('child_process');
app.get('/api/ping', (req, res) => {
  const host = req.query.host;
  // ⚠️ VULNERABILIDAD: Concatenación directa de input en comando shell
  exec('ping ' + host, (error, stdout) => {
    res.json({ result: stdout });
  });
});

// --------------------------------------------------------------------------------
// PROBLEMA #3: Server-Side Request Forgery - SSRF (CWE-918)
// --------------------------------------------------------------------------------
// ¿Qué detectará CodeQL?
// - Peticiones HTTP a URLs proporcionadas por el usuario sin validación
// - Riesgo: Un atacante puede hacer que el servidor acceda a recursos internos
//   o externos arbitrarios (APIs internas, cloud metadata, escaneo de puertos)
// Severidad esperada: HIGH/MEDIUM
// Ejemplo de ataque: ?url=http://169.254.169.254/latest/meta-data/
//                    ?url=http://localhost:8080/admin
app.get('/api/fetch-data', async (req, res) => {
  const targetUrl = req.query.url;
  try {
    // ⚠️ VULNERABILIDAD: Permite peticiones HTTP a URLs arbitrarias
    // El servidor puede ser usado como proxy para atacar recursos internos
    const response = await fetch(targetUrl);
    const data = await response.text();
    res.json({ data, source: targetUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
