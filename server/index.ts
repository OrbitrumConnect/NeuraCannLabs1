import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { registerRoutes } from "./routes.js";
import { startViteServer } from "./vite.js";

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

// Register API routes
const server = await registerRoutes(app);

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/client')));
  app.use('/attached_assets', express.static(path.join(__dirname, '../attached_assets')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/client/index.html'));
  });
} else {
  // Development with Vite
  await startViteServer(app, server);
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