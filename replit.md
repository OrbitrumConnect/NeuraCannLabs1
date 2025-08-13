# NeuroCann Lab

## Overview
NeuroCann Lab is an advanced medical platform integrating AI, real-time data visualization, and an immersive interface for scientific analysis of medical cannabis. It functions as a "knowledge neural web" connecting scientific studies, clinical cases, and regulatory alerts via specialized AI. The platform enables deep exploration and discovery of medical correlations through an intelligent cross-search system where users can query in natural language and receive integrated analyses from multiple scientific databases. Its vision includes continuous learning, functional coherence, and an intuitive, visually harmonious interface. The system is designed to be a complete professional medical system ready for clinical use, with a unique competitive edge in AI-powered scientific submission and review.

## User Preferences
**Communication Style**: Simple, everyday language.

**Platform Evolution Vision**:
- Sistema deve evoluir e aprender continuamente
- Análise automática do app a cada 10 minutos durante desenvolvimento
- Foco na coerência total do sistema e experiência harmônica
- Cada funcionalidade deve se integrar naturalmente com as existentes
- Interface deve ser intuitiva: cards principais fixos, sub-pesquisas móveis
- Prioridade: organização visual harmônica que permite leitura simultânea
- Interface limpa: avatar Dra. Cannabis IA ajustado para w-[31rem] h-[31rem], apenas botão "Ativar Dra.", sem textos descritivos laterais
- Triggers de navegação: Home, Científico, Clínico e Fórum aparecem após ativação da Dra. Cannabis IA

**Correções Críticas Implementadas (Dezembro 2024)**:
- **Respostas Contextuais**: Sistema agora adapta tamanho das respostas ao contexto - concisas quando apropriado, detalhadas quando necessário
- **Auto-Submissão Mobile**: Áudio capturado agora processa automaticamente e gera respostas da Dra. Cannabis sem necessidade de cliques adicionais
- **Dra. Cannabis IA Livre (Janeiro 2025)**: Avatar removido de todos os cards containers, agora flutua livremente na interface com fundo totalmente transparente e dimensões otimizadas para consistência visual com a plataforma

**Padronização Final NeuroCann (Janeiro 2025)**:
- **Paleta Rigorosamente Aplicada**: 70% verde neon, 20% amarelo warning, 10% vermelho alert em TODOS os elementos
- **Card "Consulta com Dra. Cannabis"**: Totalmente padronizado com cores NeuroCann - ícones, botões, backgrounds, bordas
- **Símbolo IA**: Verde neon com glow e texto preto para contraste perfeito
- **Botões de Ação**: Verde neon (principal), amarelo (resumo), vermelho (encaminhamento médico)
- **Funcionalidade Mobile**: Voz funcionando com ElevenLabs + backup nativo, processamento automático

**Integração Supabase (Agosto 2025)**:
- **SUPABASE INTEGRADO**: Sistema de persistência de dados configurado com fallback MemStorage
- **Credenciais Configuradas**: URL e chave anônima integradas ao sistema  
- **Usuário de Teste**: teste@neurocann.com criado automaticamente para desenvolvimento
- **Tabelas Preparadas**: Scripts SQL prontos para criação no painel Supabase
- **Sistema Híbrido**: MemStorage para funcionamento imediato + Supabase para persistência
- **Aprendizado Contínuo**: Conversas da NOA serão salvas no Supabase após execução do script

**Atualizações Mais Recentes (Agosto 2025)**:
- **NOA ESPERANÇA FINE-TUNED**: Modelo personalizado `ft:gpt-3.5-turbo-0125:personal:fine-tuning-noa-esperanza-avaliacao-inicial-dez-ex-jsonl:BR0W02VP` integrado
- **Comportamento Médico Empático**: NOA treinada pelo usuário ativa com anamnese completa e exploração emocional
- **Voz Feminina Garantida**: Microsoft Maria (português) configurada como padrão para manter consistência
- **Cruzamento de Dados**: NOA acessa estudos científicos, casos clínicos e conversas da plataforma em tempo real
- **Interface Limpa**: Chat otimizado com mensagens contrastadas e design profissional
- **SISTEMA DUAL NOA (Agosto 2025)**: Avatar principal + Avatar estudos cruzados compartilham mesma inteligência NOA ESPERANÇA
- **Aprendizado Contínuo Ativo**: Ambos avatares aprendem automaticamente com todos os dados da plataforma (estudos, casos, conversas anteriores)
- **LIMITAÇÃO DE RESPOSTAS IMPLEMENTADA**: Card principal limitado a 8 frases, estudos cruzados a 10 frases com análise técnica detalhada
- **ANÁLISE DE DADOS CRUZADOS APERFEIÇOADA**: Foco em dosagens específicas, correlações quantificadas, protocolos de titulação e padrões terapêuticos
- **CONTROLES AVANÇADOS DE CARDS**: Botões minimizar (amarelo) e fechar (vermelho) com abertura automática ao pesquisar
- **RASCUNHO AUTOMÁTICO (Agosto 2025)**: Estudos de dados cruzados agora mostram rascunho automaticamente quando há conversação ativa - não precisa mais clicar "Ver"
- **GERADOR DE ESTUDOS COLABORATIVO (Agosto 2025)**: Sistema totalmente integrado com contexto da NOA - usa todas as conversas, estudos e casos da plataforma para criar estudos colaborativos. Chat em tempo real no rascunho permite criação conjunta usuário+NOA
- **FLUXO COMPLETO IMPLEMENTADO (Agosto 2025)**: Fluxo Paciente→Médico→Plataforma→Admin documentado e funcional. Sistema de aprendizado contínuo (diário/semanal/mensal) com potência de dados para gerar conhecimento científico automaticamente.
- **UNIFICAÇÃO ESTUDOS CIENTÍFICOS (Agosto 2025)**: Sistema unificado no "Estudos de Dados Cruzados" (ImprovedCosmicMap)
  - Migração completa do "Meu Estudo" para a Visão Geral 
  - Assistente de Estudos Científicos integrado com funcionalidades completas
  - Analytics em tempo real (progresso, contagem de palavras)
  - Mini calendário para próximas sessões de estudo
  - Interface unificada: gerar estudos completos, melhorar rascunhos, continuar com IA
  - Endpoints `/api/generate-study` e `/api/study-draft` mantidos com contexto cruzado
  - Otimização: 11 arquivos de teste de áudio ElevenLabs removidos, componentes obsoletos limpos
  - Documentação consolidada: 10 arquivos MD desnecessários removidos para melhor organização

## System Architecture

### Frontend Architecture
- **Framework & Build Tool**: React 18 with TypeScript and Vite.
- **UI Framework**: shadcn/ui components built on Radix UI primitives, styled with Tailwind CSS (custom dark theme, cyberpunk-inspired colors).
- **3D Graphics**: Three.js integration via @react-three/fiber and @react-three/drei for interactive 3D avatars and holographic effects.
- **State Management**: TanStack Query (React Query) for server state; React hooks for local state.
- **Routing**: Wouter for lightweight client-side routing.
- **UI/UX Decisions**: Fixed main cards, expandable bottom dock for sub-searches, professional zoom/pan (50%-200%), precise handles (6x6px) on sub-search icons, main card expanded to 480px height, responsive layout with intelligent absolute positioning, hover effects and smooth transitions. The main interface focuses on the Dr. Cannabis AI avatar, which controls system activation. Layout is optimized for mobile with a reorganized menu, relative positioning for elements, and vertically stacked sub-searches.
- **Scanner System**: Horizontal line scanner with synchronized avatar glow effect. Yellow line appears during 22%-32% of screen scan (1 second duration). Dr. Cannabis avatar glows yellow from 12%-20% (perfect timing - 0.4s anticipation). Soft yellow color (rgba(255,235,59)) with 30% reduced intensity for elegant effect.
- **Design Principles**: Consistent brand identity with a permanent night mode (dark medical interface) and emerald/green as the primary medical color across all UI elements. Standardized dashboard dimensions for visual harmony. Complete color standardization implemented across all dashboards using emerald-400/emerald-500/emerald-600 palette for consistent branding.

### Backend Architecture
- **Runtime & Framework**: Node.js with Express.js for RESTful API endpoints, using ES modules.
- **Development Setup**: Custom Vite integration for HMR and seamless frontend-backend integration.
- **API Design**: RESTful endpoints for scientific studies (`/api/scientific`), clinical cases (`/api/clinical`), alerts (`/api/alerts`), user profiles (`/api/profile`), and the new continuous learning system (`/api/learning/*`).
- **Data Storage**: Currently uses in-memory storage (MemStorage class) with an architecture designed for easy swap to database implementations.
- **Continuous Learning System**: Automatically saves and analyzes all user conversations to improve AI responses over time. Includes pattern recognition, success rate tracking, and AI-generated insights.

### Database Schema Design
- **ORM & Validation**: Drizzle ORM with PostgreSQL dialect configured; Zod schemas for runtime validation and type safety.
- **Data Models**: Users (medical professionals), Scientific Studies, Clinical Cases, Alerts, Study Submissions.
- **Learning System Models** (Added December 2024):
  - **Conversations**: Stores all user-AI interactions with context, medical topics, and success metrics
  - **Learning Patterns**: Tracks recurring patterns in conversations with frequency and success rates
  - **AI Insights**: Auto-generated insights from conversation analysis for system improvement
  - **User Feedback**: Optional feedback system for conversation quality assessment

### Feature Specifications
- **REVOLUCIONÁRIA DOUTORA CANNABIS IA v3.0**: Sistema de consulta médica TRANSFORMADOR que quebra paradigmas da medicina tradicional através de:
  - **Anamnese Completa e Empática**: Vai além de sintomas, explorando história de vida, aspectos emocionais, traumas, relacionamentos e contexto social
  - **Abordagem Investigativa Profunda**: Sempre pergunta "há mais alguma coisa?" até esgotar todos os aspectos do paciente
  - **Educação Médica Inovadora**: Para profissionais e pacientes, mudando metodologia de ensino médico tradicional
  - **Personalização Adaptativa**: Adapta-se ao perfil comunicativo (conversas longas/profundas vs diretas/focadas)
  - **Relatórios Médicos Integrais**: Gera resumos clínicos, emocionais e de vida detalhados para médicos parceiros

- **Sistema de Consulta Empática**: 
  - Respostas conversacionais que sempre aprofundam e investigam
  - Validação de sentimentos e acolhimento emocional
  - Perguntas exploratórias contínuas sobre contexto de vida
  - Análise integral: sintomas + emoções + história pessoal

- **Core Functionality**: Intelligent cross-search allowing natural language queries, integrated analysis from three simultaneous databases, and contextual suggestions for sub-searches.
- **AI Capabilities**: Specialized AI for cross-analysis, semantic analysis, contextual suggestions, automatic detection of common medical errors, and intelligent contextual chat that reads user notes and cross-references data. The Dr. Cannabis AI avatar is interactive and controls system activation.
- **Audio Features**: Animação de boca simulada implementada com detecção de fala ativa (isAvatarSpeaking), Text-to-Speech otimizado para leitura de conteúdo médico.
- **Search Interface Auto-Activation**: Correção crítica aplicada - pesquisas agora ativam automaticamente o Dr AI (isDrAIActive) mostrando todas as opções de chat, exploração e estudos conforme funcionamento normal do sistema.

### Sistema de Aprendizado Contínuo v3.0 (Implementado Dezembro 2024)
- **"Conversa Sensorial Recíproca"**: Sistema revolucionário que captura, analisa e aprende de TODAS as interações dos usuários
- **Padrões Médicos Inteligentes**: IA identifica automaticamente padrões recorrentes (epilepsia + ansiedade, CBD + dor crônica, etc.) e melhora respostas baseadas na frequência e taxa de sucesso
- **Insights Auto-Gerados**: Sistema cria automaticamente insights sobre melhores práticas médicas baseado em análise de conversas reais
- **Evolução Contínua**: Cada conversa alimenta a inteligência da Dra. Cannabis, tornando-a mais precisa e personalizada ao longo do tempo
- **Métricas de Sucesso**: Rastreamento de satisfação, duração das consultas, tópicos médicos mais discutidos e taxa de encaminhamentos

### Integração de APIs Externas de Conhecimento (Preparado Dezembro 2024)
- **Sistema Modular Expansível**: Arquitetura preparada para receber e integrar múltiplas APIs de conhecimento médico externo
- **Integração Inteligente**: Combina automaticamente dados de diferentes fontes (PubMed, ClinicalTrials.gov, ANVISA, etc.) com padrões aprendidos
- **Confiança Baseada em Fontes**: Sistema calcula nível de confiança baseado no número de fontes confirmando uma informação
- **Conhecimento Contextual**: APIs externas são filtradas e contextualizadas com base nos padrões de aprendizado existentes
- **Endpoint de Demonstração**: `/api/knowledge/integrate` mostra como múltiplas APIs se combinam com o conhecimento da Dra. Cannabis

**API Endpoints do Sistema de Aprendizado**: 
  - `/api/learning/conversations` - Histórico completo de conversas
  - `/api/learning/patterns` - Padrões médicos identificados
  - `/api/learning/insights` - Insights gerados pela IA
  - `/api/learning/feedback` - Sistema de feedback dos usuários
  - `/api/knowledge/integrate` - Demonstração de integração de APIs externas

## External Dependencies
- **Database**: Neon serverless PostgreSQL (configured via Drizzle ORM).
- **UI Components**: Radix UI primitives, Lucide React for icons.
- **3D Libraries**: Three.js, @react-three/fiber, @react-three/drei.
- **Development Tools**: Replit-specific plugins, ESBuild, PostCSS with Autoprefixer.
- **APIs**: PubMed, ClinicalTrials.gov, ANVISA.