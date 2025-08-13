# 🚀 GUIA COMPLETO DE DEPLOYMENT - NEUROCANN LAB
## Vercel + Supabase Production Setup

### 📋 PRÉ-REQUISITOS

#### 1. Contas Necessárias
- [Vercel](https://vercel.com) (deployment frontend/backend)
- [Supabase](https://supabase.com) (banco PostgreSQL)
- [OpenAI](https://openai.com) (API ChatGPT-4)
- [D-ID](https://d-id.com) (avatar animado - opcional)
- [ElevenLabs](https://elevenlabs.io) (síntese de voz - opcional)

---

## 🗄️ CONFIGURAÇÃO DO SUPABASE

### 1. Criar Projeto no Supabase
1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em "New Project"
3. Nome: `neurocann-lab`
4. Password: (anote essa senha!)
5. Region: South America (São Paulo)

### 2. Executar Script SQL
1. No dashboard do Supabase, vá em "SQL Editor"
2. Clique em "+ New Query"
3. Cole o conteúdo completo do arquivo `SCRIPT_SUPABASE_FINAL.sql`
4. Execute o script (Run)

### 3. Obter Credenciais do Supabase
No dashboard do Supabase:
- Vá em "Settings" → "API"
- Copie:
  - `Project URL` (SUPABASE_URL)
  - `anon public` key (SUPABASE_ANON_KEY)
  - `service_role` key (SUPABASE_SERVICE_ROLE_KEY)
- Vá em "Settings" → "Database"
- Copie a `Connection string` → `URI` (DATABASE_URL)
- Substitua `[YOUR-PASSWORD]` pela senha do projeto

---

## 🔧 CONFIGURAÇÃO DAS APIs

### 1. OpenAI (Obrigatória)
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Vá em "API Keys"
3. Clique "Create new secret key"
4. Nome: `NeuroCann-Lab`
5. Copie a chave (OPENAI_API_KEY)

### 2. D-ID (Opcional - Avatar Animado)
1. Acesse [studio.d-id.com](https://studio.d-id.com)
2. Vá em "API"
3. Copie a chave (DID_API_KEY)

### 3. ElevenLabs (Opcional - Síntese de Voz)
1. Acesse [elevenlabs.io](https://elevenlabs.io)
2. Vá em "Profile" → "API Key"
3. Copie a chave (ELEVENLABS_API_KEY)

---

## 🚀 DEPLOYMENT NO VERCEL

### 1. Preparar o Código
1. Baixe este projeto completo
2. Remova a pasta `.git` (se existir)
3. Execute `npm install` (se necessário testar localmente)

### 2. Configurar no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique "New Project"
3. Importe o projeto (GitHub, upload zip, ou arrastar pasta)
4. Nome do projeto: `neurocann-lab`

### 3. Configurar Variáveis de Ambiente
No dashboard da Vercel, vá em "Settings" → "Environment Variables":

```env
# Database (Obrigatório)
DATABASE_URL=postgresql://postgres:[SENHA]@db.[PROJETO-ID].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJETO-ID].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Session (Obrigatório - gere uma string aleatória de 32+ caracteres)
SESSION_SECRET=super_secret_key_32_chars_minimum_for_production

# AI APIs (Configure conforme disponível)
OPENAI_API_KEY=sk-...
DID_API_KEY=Basic [sua-chave-did]
ELEVENLABS_API_KEY=sk-...

# Production
NODE_ENV=production

# Domínios (substitua pelo seu domínio Vercel)
REPLIT_DOMAINS=seu-projeto.vercel.app
```

### 4. Configurações de Build
Vercel deve detectar automaticamente, mas confirme:
- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 5. Deploy
1. Clique "Deploy"
2. Aguarde o build e deployment

---

## 🔗 CONFIGURAÇÃO DE DOMÍNIO (Opcional)

### Domínio Personalizado
1. No Vercel: "Settings" → "Domains"
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Atualize `REPLIT_DOMAINS` com novo domínio

---

## ✅ VERIFICAÇÃO PÓS-DEPLOYMENT

### 1. Testes Básicos
- [ ] Site carrega: `https://seu-projeto.vercel.app`
- [ ] Avatar da Dra. Cannabis aparece
- [ ] Consegue fazer pesquisas na Central de Inteligência
- [ ] Dados cruzados funcionam
- [ ] Sistema de estudos colaborativos ativo

### 2. Testes das APIs
- [ ] ChatGPT responde às consultas
- [ ] Dados são salvos no Supabase
- [ ] Sistema de aprendizado ativo

### 3. Performance
- [ ] Lighthouse Score > 90
- [ ] Tempo de carregamento < 3s
- [ ] Mobile responsivo

---

## 🛠️ TROUBLESHOOTING

### Erros Comuns

#### "Database connection failed"
- Verifique `DATABASE_URL` no Supabase
- Confirme que o script SQL foi executado
- Teste conexão no SQL Editor do Supabase

#### "OpenAI API Error"
- Verifique `OPENAI_API_KEY`
- Confirme créditos disponíveis na conta OpenAI
- Teste chave em [platform.openai.com](https://platform.openai.com)

#### "Build failed"
- Verifique logs de build no Vercel
- Confirme todas dependências em `package.json`
- Tente build local: `npm run build`

#### "502 Bad Gateway"
- Verifique variáveis de ambiente no Vercel
- Confirme `vercel.json` está configurado
- Verifique logs de função serverless

### Logs e Monitoramento
- **Vercel**: Dashboard → Functions → View Logs
- **Supabase**: Dashboard → Logs
- **Browser**: F12 → Console

---

## 📊 MONITORAMENTO PÓS-DEPLOYMENT

### Métricas Importantes
- Uptime do site
- Tempo de resposta das APIs
- Uso do banco de dados
- Quotas das APIs (OpenAI, D-ID, ElevenLabs)

### Supabase Dashboard
- Monitor de conexões de banco
- Uso de storage
- Logs de autenticação

### Vercel Analytics
- Performance do site
- Uso de bandwidth
- Logs de função serverless

---

## 🔄 ATUALIZAÇÕES FUTURAS

### Processo de Deploy
1. Faça alterações no código
2. Commit/upload para o repositório
3. Vercel faz deploy automático
4. Teste em staging (se configurado)
5. Verifique produção

### Backup do Banco
1. Supabase faz backups automáticos
2. Para backup manual: SQL Editor → Export
3. Mantenha versões do script SQL atualizadas

---

## 📞 SUPORTE

### Documentação
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

### Status das APIs
- [Vercel Status](https://vercel-status.com)
- [Supabase Status](https://status.supabase.com)
- [OpenAI Status](https://status.openai.com)

---

🎯 **RESULTADO FINAL**: NeuroCann Lab totalmente funcional em produção com todas as funcionalidades:
- Central de Inteligência Unificada
- Sistema de dados cruzados
- Dra. Cannabis IA com NOA
- Estudos colaborativos
- Sistema completo de aprendizado
- Interface responsiva e profissional

**Credenciais de Admin**: phpg69@gmail.com / n6n7n8N9!horus