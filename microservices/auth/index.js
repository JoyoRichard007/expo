const express = require('express');
const { Client } = require('pg');
const app = express();

app.use(express.json());

// Connexion PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
});

client.connect();

// Créer la table users si elle n'existe pas
client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    name VARCHAR(100)
  )
`);

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    // Pour l'instant, pas de hash de mot de passe (simulation)
    if (!user || password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      token: 'fake-jwt-token-' + Date.now(),
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Créer un utilisateur (inscription)
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    const result = await client.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, password, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Vérifier un token
app.get('/verify', (req, res) => {
  const token = req.headers.authorization;
  // Pour l'instant, token factice
  res.json({ valid: true, message: 'Token valid from auth service' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Auth service running on port ${PORT}`);
});