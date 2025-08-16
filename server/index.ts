import express from "express";
import cors from "cors";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";
import { registerRoutes } from "./routes.js";

const app = express();

// CORS configuration - NUNCA ALTERAR
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Session setup - NUNCA ALTERAR
const MemStore = MemoryStore(session);
app.use(session({
  secret: process.env.SESSION_SECRET || 'neurocann_secret_key_2024',
  resave: false,
  saveUninitialized: true,
  store: new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Body parsing - NUNCA ALTERAR
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files - OBRIGATÓRIO
app.use(express.static('client/dist'));

// Register API routes
registerRoutes(app);

// FALLBACK PARA SPA - ESSENCIAL
app.get('*', (req, res) => {
  // Não servir static para APIs
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API not found' });
  }
  
  // Servir index.html para todas as rotas do frontend
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 3000;

// For Vercel serverless
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  });
}