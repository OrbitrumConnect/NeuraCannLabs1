import { createServer } from 'http';
import { registerRoutes } from '../server/routes.js';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MemoryStore from 'memorystore';

const app = express();

// Configurar CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Configurar sessões
const MemoryStoreSession = MemoryStore(session);
app.use(session({
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // 24 horas
  }),
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configurar JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Registrar todas as rotas
await registerRoutes(app);

// Servir arquivos estáticos
app.use(express.static('client/dist'));

// Rota fallback para SPA
app.get('*', (req, res) => {
  res.sendFile('client/dist/index.html', { root: '.' });
});

// Criar servidor HTTP
const server = createServer(app);

// Exportar para Vercel
export default server;
