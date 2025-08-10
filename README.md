# 🧬 NeuroCann Lab v3.0

**Plataforma médica avançada com IA especializada em cannabis medicinal**

## 🚀 Demo Live
Deploy: `https://neurocann-lab.vercel.app` (após configuração)

## ✨ Recursos Principais

### 🤖 Dr. Cannabis IA
- Avatar 3D interativo especializado em cannabis medicinal
- Pesquisa científica em linguagem natural
- Análises cruzadas de estudos científicos

### 📱 Interface Mobile-First
- Design responsivo otimizado para todos os dispositivos  
- Navegação intuitiva com cards fixos e sub-pesquisas móveis
- Experiência harmônica e coerente

### 🔬 Base Científica Real
- Integração com PubMed e bases científicas
- Dados sempre atualizados e verificados
- Foco no mercado brasileiro e regulamentações ANVISA

### 🎵 Recursos Avançados
- Text-to-Speech para leitura de resultados
- Sistema de submissão de estudos
- Dashboard administrativo completo
- Fórum integrado de discussões

## 💰 Estratégia de Preços

- **Básico**: R$ 19/mês (62% mais barato que concorrentes)
- **Premium**: R$ 35/mês (consultas ilimitadas + áudio)  
- **Hospitalar**: R$ 199/mês (multi-usuários)

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** + TypeScript + Vite
- **shadcn/ui** + Tailwind CSS (tema dark cyberpunk)
- **Three.js** para avatar 3D e efeitos holográficos
- **TanStack Query** para state management
- **Wouter** para roteamento

### Backend  
- **Node.js** + Express.js (serverless ready)
- **Drizzle ORM** + PostgreSQL
- **APIs científicas** (PubMed, ClinicalTrials.gov)
- **Autenticação** opcional via Replit Auth

## 📦 Deploy Rápido

### 1. Supabase Setup
```bash
1. Criar projeto em https://app.supabase.com
2. Copiar DATABASE_URL da aba Settings > Database  
```

### 2. Vercel Deploy
```bash
1. Fork/clone este repositório
2. Importar no Vercel (https://vercel.com)
3. Configurar variáveis de ambiente:
   - DATABASE_URL=sua_url_supabase
   - SESSION_SECRET=chave_secreta_32_chars
4. Deploy automático!
```

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Editar DATABASE_URL no .env

# Executar migrations  
npm run db:push

# Iniciar aplicação
npm run dev
# Acesse: http://localhost:5000
```

## 📊 Arquitetura do Projeto

```
neurocann-lab/
├── client/                 # Frontend React
│   ├── src/components/    # Componentes UI
│   ├── src/pages/         # Páginas da aplicação
│   └── index.html         # Entry point
├── server/                 # Backend Express
│   ├── routes.ts          # API endpoints
│   └── ai-search.ts       # IA e busca científica
├── shared/                 # Schemas compartilhados
└── vercel.json            # Config deploy
```

## 🎯 Mercado e Competitividade

### Concorrentes Principais:
- **UpToDate**: R$ 208/mês (5x mais caro)
- **Whitebook**: R$ 50/mês (2.6x mais caro)  
- **Medscape**: Grátis (mas só inglês)

### Nossa Vantagem:
- ✅ **IA especializada** em cannabis medicinal
- ✅ **Preços competitivos** (62% mais barato)
- ✅ **Português nativo** + dados brasileiros
- ✅ **Interface moderna** com avatar 3D
- ✅ **Mobile-first** otimizado

## 📈 Projeção de Receita

**Meta Conservadora (2025):**
- 2.000 usuários × R$ 19/mês = R$ 38K/mês
- 1.000 usuários × R$ 35/mês = R$ 35K/mês  
- 150 hospitais × R$ 199/mês = R$ 30K/mês

**Total: R$ 103K/mês de receita**  
**Custos: R$ 15K/mês**  
**Lucro: R$ 88K/mês (85% margem)**

## 📄 Licença

MIT License - Projeto open source

---

**Desenvolvido com 💚 para revolucionar a medicina canábica no Brasil**