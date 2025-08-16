import express from "express";
import cors from "cors";
import session from "express-session";
import MemoryStore from "memorystore";

const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Session setup
const MemStore = MemoryStore(session);
app.use(session({
  secret: process.env.SESSION_SECRET || 'neurocann-lab-secret-key',
  resave: false,
  saveUninitialized: true,
  store: new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: false,
    secure: false
  }
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import and register routes
import { registerRoutes } from "../../server/routes.js";

// Register API routes
await registerRoutes(app);

// For Vercel serverless
export default app;