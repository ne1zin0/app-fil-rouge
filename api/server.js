// API REST du projet fil rouge « DevOps Notes »
const express = require('express');
const { Pool } = require('pg');
const client = require('prom-client');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'notes',
  password: process.env.DB_PASSWORD || 'notes',
  database: process.env.DB_NAME || 'notesdb',
});

// --- Observabilité : métriques Prometheus (lab J6) ---
const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });
const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// --- Santé ---
app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
app.get('/readyz', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ready' });
  } catch (e) {
    res.status(503).json({ status: 'not-ready', error: e.message });
  }
});
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

// --- API métier ---
app.get('/api/notes', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, content, created_at FROM notes ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post('/api/notes', async (req, res) => {
  const { content } = req.body || {};
  if (!content) return res.status(400).json({ error: 'content requis' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO notes(content) VALUES($1) RETURNING id, content, created_at', [content]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`API à l'écoute sur le port ${PORT}`));
}
module.exports = app;
