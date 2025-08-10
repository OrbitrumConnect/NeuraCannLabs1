# 🚀 Deploy NeuroCann Lab - Vercel + Supabase

## 📋 Pré-requisitos

### 1. Criar projeto no Supabase:
- Acesse: https://app.supabase.com
- Crie novo projeto
- Anote: `DATABASE_URL` da aba Settings > Database

### 2. Preparar deploy no Vercel:
- Acesse: https://vercel.com
- Conecte com GitHub/GitLab
- Importe este projeto

## ⚙️ Variáveis de Ambiente (Vercel)

Configure estas variáveis no painel do Vercel:

```bash
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]

# Session (gere uma string aleatória de 32+ caracteres)
SESSION_SECRET=sua_chave_super_secreta_aqui_32_chars_min

# Replit domains (opcional, para OAuth)
REPLIT_DOMAINS=seu-dominio.vercel.app
ISSUER_URL=https://replit.com/oidc
REPL_ID=seu-repl-id-opcional
```

## 🛠️ Scripts de Build

O projeto já está configurado com:

- **Frontend**: Build automático via Vite
- **Backend**: Serverless functions Node.js 18
- **Database**: Drizzle ORM + PostgreSQL

## 🎯 Deploy Step-by-Step

1. **Upload do projeto** para GitHub/GitLab
2. **Import no Vercel** 
3. **Configure Environment Variables**
4. **Deploy!**

## 🧪 Teste Local

```bash
# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Edite DATABASE_URL e SESSION_SECRET

# Rodar migrations
npm run db:push

# Iniciar desenvolvimento
npm run dev
```

## 📊 Estrutura Final Otimizada

```
neurocann-lab/
├── client/          # Frontend React+Vite
├── server/          # Backend Express+API
├── shared/          # Schemas compartilhados
├── vercel.json      # Configuração Vercel
├── package.json     # Dependencies
└── README.md        # Documentação
```

## ✅ Recursos Incluídos

- ✅ Interface 3D com Dr. Cannabis IA
- ✅ Sistema de pesquisa científica
- ✅ Dashboard médico completo
- ✅ Text-to-Speech integrado
- ✅ Mobile responsivo
- ✅ Database PostgreSQL
- ✅ Autenticação (opcional)

## 🚀 URL Final

Após deploy: `https://neurocann-lab.vercel.app`

---
**💰 Estratégia de Preços Definida:**
- Básico: R$ 19/mês
- Premium: R$ 35/mês  
- Hospitalar: R$ 199/mês