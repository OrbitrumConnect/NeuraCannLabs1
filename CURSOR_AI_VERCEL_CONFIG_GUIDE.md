# 🚀 GUIA CURSOR AI - CONFIGURAÇÃO VERCEL NEUROCANN LAB

## 📋 CONFIGURAÇÃO ESPECÍFICA PARA DEPLOY NO VERCEL

### 🎯 ARQUITETURA ATUAL DO PROJETO

**ESTRUTURA CORRETA:**
```
JobBoard/
├── client/                 # Frontend React + Vite
├── server/                 # Backend Express.js
├── api/server/index.ts     # Entry point Vercel
├── vercel.json            # Configuração Vercel
└── package.json           # Dependências
```

### 1️⃣ CONFIGURAÇÃO VERCEL.JSON (ATUAL)

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/server/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**IMPORTANTE:** NÃO usar `functions` block - causa erro "Function Runtimes"

### 2️⃣ ENTRY POINT VERCEL (api/server/index.ts)

```typescript
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
    checkPeriod: 86400000
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
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
```

### 3️⃣ VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS

**NO VERCEL DASHBOARD → Settings → Environment Variables:**

```env
# Supabase (OBRIGATÓRIO)
DATABASE_URL=postgresql://postgres:[SENHA]@rfjshppjhjtwtbqhlaio.supabase.co:5432/postgres
SUPABASE_URL=https://rfjshppjhjtwtbqhlaio.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmanNocHBqaGp0d3RicWhsYWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNjk2MjAsImV4cCI6MjA3MDY0NTYyMH0.zN4bYUDnFB7l43HaFRgyJ_Jv2R-XDYVH_rDpQFEO634
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY_AQUI]

# OpenAI (OBRIGATÓRIO)
OPENAI_API_KEY=[SUA_OPENAI_API_KEY]

# Session
SESSION_SECRET=super_secret_key_32_chars_minimum_for_production

# Production
NODE_ENV=production
REPLIT_DOMAINS=neurocann-lab.vercel.app

# D-ID (OPCIONAL)
DID_API_KEY=[DID_API_KEY_SE_TIVER]

# ElevenLabs (OPCIONAL)
ELEVENLABS_API_KEY=[ELEVENLABS_API_KEY_SE_TIVER]
```

### 4️⃣ PACKAGE.JSON CONFIGURAÇÃO

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "start": "node dist/server/index.js",
    "vercel-build": "npm run build"
  },
  "dependencies": {
    "@vercel/node": "^3.0.0",
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "express-session": "^1.17.0",
    "memorystore": "^1.6.0"
  }
}
```

### 5️⃣ PONTOS CRÍTICOS PARA CURSOR AI

#### ✅ IMPORTS CORRETOS
```typescript
// SEMPRE usar .js (não .ts) para imports
import { registerRoutes } from "../../server/routes.js";
```

#### ✅ ESTRUTURA DE ARQUIVOS
- **NÃO criar** arquivos separados em `api/` para cada endpoint
- **USAR** `server/routes.ts` como único arquivo de rotas
- **ENTRY POINT** deve ser `api/server/index.ts`

#### ✅ LIMITE DE FUNÇÕES VERCEL
- **MÁXIMO 12** Serverless Functions no plano Hobby
- **NÃO criar** arquivos individuais para cada endpoint
- **USAR** Express.js unificado

### 6️⃣ FLUXO DE DEPLOY CORRETO

#### PASSO 1: PREPARAÇÃO
```bash
# Verificar estrutura
ls -la
# Deve mostrar: client/, server/, api/, vercel.json

# Verificar entry point
cat api/server/index.ts
# Deve importar de "../../server/routes.js"
```

#### PASSO 2: BUILD LOCAL
```bash
npm run build
# Deve compilar sem erros
```

#### PASSO 3: DEPLOY VERCEL
```bash
git add .
git commit -m "Deploy Vercel - configuração correta"
git push
```

### 7️⃣ TROUBLESHOOTING PARA CURSOR AI

#### ❌ ERRO: "Function Runtimes must have a valid version"
**SOLUÇÃO:** Remover `functions` block do `vercel.json`

#### ❌ ERRO: "Cannot find module '@vercel/node'"
**SOLUÇÃO:** Não usar `@vercel/node` - usar configuração atual

#### ❌ ERRO: "Module not found"
**SOLUÇÃO:** Verificar imports usando `.js` (não `.ts`)

#### ❌ ERRO: "No more than 12 Serverless Functions"
**SOLUÇÃO:** Usar Express.js unificado em `server/routes.ts`

#### ❌ ERRO: "500 Internal Server Error"
**SOLUÇÃO:** Verificar variáveis de ambiente no Vercel Dashboard

### 8️⃣ VERIFICAÇÃO PÓS-DEPLOY

#### ✅ TESTES OBRIGATÓRIOS
1. **Site carrega:** `https://neurocann-lab.vercel.app`
2. **API funciona:** `https://neurocann-lab.vercel.app/api/doctor/consult`
3. **Dra. Cannabis ativa:** Avatar aparece e responde
4. **Banco conectado:** Dados salvos no Supabase

#### ✅ LOGS VERCEL
```bash
# Verificar logs
vercel logs
# Procurar por erros de import ou variáveis
```

### 9️⃣ CONFIGURAÇÃO IDEAL PARA CURSOR AI

#### 🎯 ARQUITETURA UNIFICADA
```
Frontend (React) → API (Express) → Database (Supabase)
     ↓                ↓                    ↓
  Interface      server/routes.ts      PostgreSQL
  DraCannabisAI  registerRoutes()      Users/Data
```

#### 🎯 FLUXO DE DADOS
```
1. Usuário interage (voz/texto)
2. Frontend chama /api/doctor/consult
3. Express processa com NOA ESPERANÇA
4. Resposta: texto + áudio + avatar
5. Dados salvos no Supabase
6. Interface atualizada
```

### 🔧 COMANDOS PARA CURSOR AI

#### VERIFICAR CONFIGURAÇÃO
```bash
# Verificar estrutura
tree -L 2

# Verificar vercel.json
cat vercel.json

# Verificar entry point
cat api/server/index.ts

# Verificar variáveis
echo $DATABASE_URL
echo $OPENAI_API_KEY
```

#### DEPLOY SEGURO
```bash
# 1. Verificar mudanças
git status

# 2. Adicionar arquivos
git add .

# 3. Commit com descrição clara
git commit -m "Deploy Vercel - configuração unificada Express.js"

# 4. Push para GitHub
git push origin main

# 5. Verificar deploy no Vercel
# Acessar: https://vercel.com/dashboard
```

### 📋 CHECKLIST FINAL

- [ ] `vercel.json` sem `functions` block
- [ ] `api/server/index.ts` importa `routes.js`
- [ ] `server/routes.ts` contém todas as rotas
- [ ] Variáveis de ambiente configuradas
- [ ] `package.json` com scripts corretos
- [ ] Build local funciona
- [ ] Deploy sem erros
- [ ] Site carrega corretamente
- [ ] API responde
- [ ] Dra. Cannabis ativa

### 🎯 RESULTADO ESPERADO

**SISTEMA FUNCIONANDO:**
- ✅ Interface React carrega
- ✅ API Express responde
- ✅ Dra. Cannabis IA ativa
- ✅ Banco Supabase conectado
- ✅ Multimodal (texto + voz + avatar)
- ✅ Histórico salvo
- ✅ Deploy estável

**ESTA É A CONFIGURAÇÃO CORRETA PARA O CURSOR AI USAR NO DEPLOY VERCEL!**
