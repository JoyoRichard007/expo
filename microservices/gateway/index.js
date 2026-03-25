const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(express.json());

// URLs des services (via variables d'environnement Railway)
const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const USERS_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';

console.log(`🔗 Auth service URL: ${AUTH_URL}`);
console.log(`🔗 Users service URL: ${USERS_URL}`);

// Proxy vers le service Auth
app.use('/auth', createProxyMiddleware({
  target: AUTH_URL,
  changeOrigin: true,
  pathRewrite: { '^/auth': '' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying to Auth: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Auth proxy error:', err.message);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}));

// Proxy vers le service Users
app.use('/users', createProxyMiddleware({
  target: USERS_URL,
  changeOrigin: true,
  pathRewrite: { '^/users': '' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying to Users: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Users proxy error:', err.message);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'gateway' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Gateway running on port ${PORT}`);
});