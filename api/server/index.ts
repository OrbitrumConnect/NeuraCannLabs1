import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { registerRoutes } from "../../server/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static assets in all environments
app.use('/attached_assets', express.static(path.join(__dirname, '../attached_assets')));

// Register API routes FIRST - antes do Vite
const server = await registerRoutes(app);

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/client')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/client/index.html'));
  });
} else {
  // Development with Vite - APENAS para rotas não-API
  try {
    const { setupVite } = await import('./vite.js');
    await setupVite(app, server);
    console.log('✅ Vite development server configured');
  } catch (error) {
    console.log('⚠️ Vite server not available, serving basic frontend');
    
    // Fallback: serve client files directly in development
    app.use(express.static(path.join(__dirname, '../client')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });
  }
}

// For Vercel serverless
export default app;

// Local development
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`🚀 NeuroCann Lab Server running on port ${PORT}`);
    console.log(`📱 Mobile-optimized interface ready`);
    console.log(`🌐 Access: http://localhost:${PORT}`);
  });
}