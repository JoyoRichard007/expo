const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log toutes les requêtes
app.use((req, res, next) => {
  console.log(`📥 Auth received: ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

app.post('/login', (req, res) => {
  console.log('🔐 Processing login...');
  const { email, password } = req.body;
  
  const response = {
    token: 'fake-jwt-token-' + Date.now(),
    user: { email, name: 'Test User' }
  };
  
  console.log('📤 Sending response:', response);
  res.json(response);
});

app.get('/health', (req, res) => {
  console.log('❤️ Health check');
  res.json({ status: 'OK', service: 'auth' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Auth service on port ${PORT}`);
});