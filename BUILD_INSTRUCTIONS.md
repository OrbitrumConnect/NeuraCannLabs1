# 🔨 INSTRUÇÕES DE BUILD - NEUROCANN LAB

## 📦 PREPARAÇÃO PARA DEPLOYMENT

### 1. Limpeza Pré-Build
```bash
# Remove builds anteriores
rm -rf dist/
rm -rf node_modules/.cache/

# Reinstala dependências (se necessário)
npm ci
```

### 2. Build de Produção
```bash
# Build completo (frontend + backend)
npm run build

# Ou build separado:
npm run build:client  # Frontend apenas
npm run build:server  # Backend apenas
```

### 3. Verificação do Build
```bash
# Estrutura esperada após build:
dist/
├── client/           # Frontend estático
│   ├── index.html
│   ├── assets/
│   └── ...
└── index.js         # Backend compilado
```

## 🚀 DEPLOYMENT AUTOMATIZADO

### Vercel (Recomendado)
```bash
# Via CLI Vercel
vercel --prod

# Ou via GitHub integration:
git push origin main
# Deploy automático via webhook
```

### Deploy Manual
```bash
# 1. Build local
npm run build

# 2. Upload dist/ para servidor
# 3. Configurar variáveis de ambiente
# 4. Iniciar: node dist/index.js
```

## ⚙️ VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS

### Banco de Dados (Supabase)
```env
DATABASE_URL=postgresql://postgres:[SENHA]@db.[PROJECT-ID].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Segurança
```env
SESSION_SECRET=[32_chars_random_string]
NODE_ENV=production
```

### APIs Essenciais
```env
OPENAI_API_KEY=sk-[sua-chave-openai]
```

### APIs Opcionais
```env
DID_API_KEY=Basic [sua-chave-did]
ELEVENLABS_API_KEY=sk-[sua-chave-elevenlabs]
```

## 🔍 VERIFICAÇÕES PRÉ-DEPLOY

### Checklist Técnico
- [ ] `npm run build` executa sem erros
- [ ] Todas variáveis de ambiente configuradas
- [ ] Script SQL executado no Supabase
- [ ] APIs testadas (OpenAI essencial)
- [ ] `vercel.json` configurado corretamente
- [ ] Assets estáticos acessíveis

### Checklist Funcional
- [ ] Login admin funciona (phpg69@gmail.com)
- [ ] Central de Inteligência carrega
- [ ] Avatar Dra. Cannabis aparece
- [ ] Pesquisas retornam resultados
- [ ] Dados cruzados funcionam
- [ ] Mobile responsivo OK

## 📊 MONITORAMENTO PÓS-DEPLOY

### Logs Críticos
```bash
# Vercel Function Logs
vercel logs --follow

# Supabase Database Logs  
# Via dashboard Supabase
```

### Métricas de Sucesso
- Site carrega < 3s
- APIs respondem < 2s  
- Zero erros 5xx
- Mobile score > 90 (Lighthouse)
- Uptime > 99.9%

## 🛠️ TROUBLESHOOTING COMUM

### "Build Failed"
```bash
# Verificar dependências
npm list --depth=0

# Limpar cache
npm run clean
rm -rf node_modules
npm install
```

### "Function Timeout"
- Verificar limites Vercel (30s máx)
- Otimizar queries database
- Implementar cache Redis se necessário

### "Database Connection Error"  
- Testar DATABASE_URL manualmente
- Verificar IP allowlist Supabase
- Confirmar pool connections

### "API Key Invalid"
- Regenerar chaves APIs
- Verificar quotas/limites
- Testar chaves em ambiente local

## 📋 COMANDOS ÚTEIS

### Desenvolvimento
```bash
npm run dev          # Servidor desenvolvimento
npm run check        # Verificação TypeScript
npm run db:push      # Atualizar schema DB
```

### Produção  
```bash
npm run build        # Build completo
npm start           # Iniciar produção
npm run vercel-build # Build específico Vercel
```

### Debug
```bash
npm run build -- --verbose    # Build com logs detalhados
NODE_ENV=production npm start  # Teste local produção
```

## 🎯 DEPLOYMENT BEM-SUCEDIDO

Após seguir estas instruções, o NeuroCann Lab estará:

✅ **Totalmente funcional em produção**  
✅ **Mobile-responsive e otimizado**  
✅ **Conectado ao Supabase**  
✅ **Integrado com OpenAI/ChatGPT-4**  
✅ **Sistema de dados cruzados ativo**  
✅ **Avatar Dra. Cannabis operacional**  
✅ **Central de Inteligência Unificada funcionando**  

**URL Final**: `https://seu-projeto.vercel.app`