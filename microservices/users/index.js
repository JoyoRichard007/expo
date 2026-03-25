const express = require('express');
const { Client } = require('pg');
const app = express();

app.use(express.json());

// Connexion PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

let dbReady = false;

// Attendre la connexion avant de démarrer
client.connect()
  .then(async () => {
    console.log('✅ Connected to PostgreSQL');
    
    // Créer la table si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100)
      )
    `);
    console.log('✅ Table users ready');
    
    dbReady = true;
  })
  .catch(err => {
    console.error('❌ DB connection error:', err.message);
  });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'users', dbReady });
});

app.get('/', async (req, res) => {
  console.log('📥 GET / request received');
  if (!dbReady) {
    console.log('❌ DB not ready');
    return res.status(503).json({ error: 'Database not ready' });
  }
  try {
    console.log('🔍 Executing SELECT * FROM users');
    const result = await client.query('SELECT * FROM users');
    console.log('✅ Query result:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Database error in GET /:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Récupérer un utilisateur par ID
app.get('/:id', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ error: 'Database not ready' });
  }
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Créer un utilisateur
app.post('/', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ error: 'Database not ready' });
  }
  const { name, email } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Users service running on port ${PORT}`);
});