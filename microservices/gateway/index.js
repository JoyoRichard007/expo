const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(express.json());

// Log toutes les requêtes entrantes
app.use((req, res, next) => {
  console.log(`🚪 Gateway received: ${req.method} ${req.url}`);
  next();
});

// Auth proxy
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/auth': '' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔄 Proxying to Auth: ${req.method} ${req.url}`);
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Auth responded with status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}));

// Users proxy
app.use('/users', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/users': '' }
}));

app.get('/health', (req, res) => {
  console.log('❤️ Gateway health check');
  res.json({ status: 'OK', service: 'gateway' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Gateway running on port ${PORT}`);
});