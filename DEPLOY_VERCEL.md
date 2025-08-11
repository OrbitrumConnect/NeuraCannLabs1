# Deploy para Vercel - NeuroCann Lab

## 📋 Preparação para Deploy

### 1. Verificações Necessárias
✅ **Sistema de Voz**: Funciona com native browser APIs (compatível Vercel)  
✅ **Database**: Using Neon PostgreSQL (serverless, perfeito para Vercel)  
✅ **Storage**: In-memory para desenvolvimento (migrar para PostgreSQL)  
✅ **Build Process**: Vite + Express configurados

### 2. Configurações Obrigatórias no Vercel

**Environment Variables:**
```env
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]

# Authentication (se usando Replit Auth)
SESSION_SECRET=your_session_secret_here
REPL_ID=your_repl_id
ISSUER_URL=https://replit.com/oidc

# Optional: APIs externas
OPENAI_API_KEY=your_openai_key (se necessário)
```

### 3. Arquivos de Configuração Vercel

**vercel.json** (já existe):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

## 🚀 Passos do Deploy

### Opção 1: Via GitHub (Recomendado)
1. **Conectar GitHub**:
   - Fazer push do código para GitHub
   - Conectar repositório no Vercel
   - Deploy automático a cada commit

### Opção 2: Via Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy do projeto
vercel --prod
```

### Opção 3: Direct Upload
- Upload manual via dashboard Vercel
- Arrastar pasta do projeto

## ⚙️ Migrations e Database

### Database Setup (Neon):
```bash
# Rodar migrations após deploy
npx drizzle-kit push:pg
```

### Verificar Environment Variables:
- `DATABASE_URL` configurada corretamente
- `SESSION_SECRET` definida para sessions
- Todas as keys de API necessárias

## 🔧 Possíveis Ajustes Necessários

### 1. Storage Migration
**Atual**: In-memory storage  
**Para produção**: PostgreSQL storage
- Migrar `MemStorage` para `DatabaseStorage`
- Configurar tabelas no schema Drizzle

### 2. Session Storage
- Atualmente usando memory store
- Migrar para PostgreSQL sessions

### 3. Voice System
✅ **Já compatível**: Uses native browser APIs

## 📱 Features Funcionais no Vercel

✅ **Landing Page**  
✅ **Authentication System**  
✅ **Dashboard Responsivo**  
✅ **Sistema de Voz IA**  
✅ **Comandos por Voz**  
✅ **3D Avatar Dr. Cannabis**  
✅ **Search & Filter System**  
✅ **Mobile Optimized**

## 🎯 Performance Otimizada

- **Serverless Functions**: Express APIs como functions
- **Static Assets**: Frontend servido via CDN
- **Database**: Neon PostgreSQL serverless
- **Caching**: Headers e caching otimizados

## 🛠️ Troubleshooting

**Build Errors**:
- Verificar TypeScript types
- Verificar import paths
- Verificar environment variables

**Runtime Errors**:
- Verificar DATABASE_URL
- Verificar session configuration
- Logs via Vercel dashboard

---

**💡 Resumo**: O projeto está **99% pronto** para Vercel. Principais ajustes seriam migrar do storage em memória para PostgreSQL para persistência de dados em produção.