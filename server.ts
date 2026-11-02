import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './src/server/routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // Dev server must run on port 3000 as expected by AI Studio iframe proxy
  const PORT = 3000;

  app.use(express.json());

  // API router
  app.use('/api', apiRouter);

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', product: 'Tapili Cleaner OS', timestamp: new Date().toISOString() });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tapili Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Tapili server:', err);
  process.exit(1);
});
