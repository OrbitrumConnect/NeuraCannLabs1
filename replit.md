# NeuroCann Lab

## Overview
NeuroCann Lab is an advanced medical platform integrating AI, real-time data visualization, and an immersive interface for scientific analysis of medical cannabis. Its purpose is to function as a "knowledge neural web" connecting scientific studies, clinical cases, and regulatory alerts via specialized AI. The platform enables deep exploration and discovery of medical correlations through an intelligent cross-search system where users can query in natural language and receive integrated analyses from multiple scientific databases. The vision includes continuous learning, functional coherence, and an intuitive, visually harmonious interface, aiming to be a complete professional medical system ready for clinical use with a competitive edge in AI-powered scientific submission and review.

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

**Interface Customization**:
- **Paleta Rigorosamente Aplicada**: 70% verde neon, 20% amarelo warning, 10% vermelho alert em TODOS os elementos
- **Card "Consulta com Dra. Cannabis"**: Totalmente padronizado com cores NeuroCann - ícones, botões, backgrounds, bordas
- **Símbolo IA**: Verde neon com glow e texto preto para contraste perfeito
- **Botões de Ação**: Verde neon (principal), amarelo (resumo), vermelho (encaminhamento médico)

**AI Interaction**:
- **Respostas Contextuais**: Sistema agora adapta tamanho das respostas ao contexto - concisas quando apropriado, detalhadas quando necessário
- **Auto-Submissão Mobile**: Áudio capturado agora processa automaticamente e gera respostas da Dra. Cannabis sem necessidade de cliques adicionais
- **Dra. Cannabis IA Livre**: Avatar removido de todos os cards containers, agora flutua livremente na interface com fundo totalmente transparente e dimensões otimizadas para consistência visual com a plataforma
- **Voz Feminina Garantida**: Microsoft Maria (português) configurada como padrão para manter consistência
- **SISTEMA DUAL NOA**: Avatar principal + Avatar estudos cruzados compartilham mesma inteligência NOA ESPERANÇA
- **Aprendizado Contínuo Ativo**: Ambos avatares aprendem automaticamente com todos os dados da plataforma (estudos, casos, conversas anteriores)
- **LIMITAÇÃO DE RESPOSTAS IMPLEMENTADA**: Card principal limitado a 8 frases, estudos cruzados a 10 frases com análise técnica detalhada
- **ANÁLISE DE DADOS CRUZADOS APERFEIÇOADA**: Foco em dosagens específicas, correlações quantificadas, protocolos de titulação e padrões terapêuticos
- **CONTROLES AVANÇADOS DE CARDS**: Botões minimizar (amarelo) e fechar (vermelho) com abertura automática ao pesquisar
- **RASCUNHO AUTOMÁTICO**: Estudos de dados cruzados agora mostram rascunho automaticamente quando há conversação ativa - não precisa mais clicar "Ver"
- **GERADOR DE ESTUDOS COLABORATIVO**: Sistema totalmente integrado com contexto da NOA - usa todas as conversas, estudos e casos da plataforma para criar estudos colaborativos. Chat em tempo real no rascunho permite criação conjunta usuário+NOA
- **UNIFICAÇÃO ESTUDOS CIENTÍFICOS**: Sistema unificado no "Estudos de Dados Cruzados" (ImprovedCosmicMap)

## System Architecture

### Frontend Architecture
- **Framework & Build Tool**: React 18 with TypeScript and Vite.
- **UI Framework**: shadcn/ui components built on Radix UI primitives, styled with Tailwind CSS (custom dark theme, cyberpunk-inspired colors).
- **3D Graphics**: Three.js integration via @react-three/fiber and @react-three/drei for interactive 3D avatars and holographic effects.
- **State Management**: TanStack Query (React Query) for server state; React hooks for local state.
- **Routing**: Wouter for lightweight client-side routing.
- **UI/UX Decisions**: Fixed main cards, expandable bottom dock for sub-searches, professional zoom/pan (50%-200%), precise handles (6x6px) on sub-search icons, main card expanded to 480px height, responsive layout with intelligent absolute positioning, hover effects and smooth transitions. The main interface focuses on the Dr. Cannabis AI avatar, which controls system activation. Layout is optimized for mobile with a reorganized menu, relative positioning for elements, and vertically stacked sub-searches. Consistent brand identity with a permanent night mode (dark medical interface) and emerald/green as the primary medical color across all UI elements. Standardized dashboard dimensions for visual harmony. Complete color standardization implemented across all dashboards using emerald-400/emerald-500/emerald-600 palette for consistent branding.
- **Scanner System**: Horizontal line scanner with synchronized avatar glow effect, soft yellow color (rgba(255,235,59)) with 30% reduced intensity for elegant effect.

### Backend Architecture
- **Runtime & Framework**: Node.js with Express.js for RESTful API endpoints, using ES modules.
- **Development Setup**: Custom Vite integration for HMR and seamless frontend-backend integration.
- **API Design**: RESTful endpoints for scientific studies (`/api/scientific`), clinical cases (`/api/clinical`), alerts (`/api/alerts`), user profiles (`/api/profile`), and the continuous learning system (`/api/learning/*`).
- **Data Storage**: Primary storage via Supabase for production deployment. All users (admin, médicos, pacientes) authenticate through Supabase. Fallback local hardcoded admin apenas para desenvolvimento.
- **Authentication**: Sistema unificado via Supabase - todos os perfis (admin, professional, patient) cadastram e fazem login pelo banco de dados. Preparado para deployment em servidor externo.
- **Continuous Learning System**: Automatically saves and analyzes all user conversations to improve AI responses over time. Includes pattern recognition, success rate tracking, and AI-generated insights. This system implements "Conversa Sensorial Recíproca" to capture, analyze, and learn from all user interactions, identifying medical patterns and generating insights.

### Database Schema Design
- **ORM & Validation**: Drizzle ORM with PostgreSQL dialect configured; Zod schemas for runtime validation and type safety.
- **Data Models**: Users (medical professionals), Scientific Studies, Clinical Cases, Alerts, Study Submissions, Conversations, Learning Patterns, AI Insights, User Feedback.

### Feature Specifications
- **Doutora Cannabis IA v3.0**: A transformative medical consultation system providing:
  - **Anamnese Completa e Empática**: Explores life history, emotional aspects, traumas, relationships, and social context.
  - **Abordagem Investigativa Profunda**: Continuously asks "is there anything else?" to exhaust all patient aspects.
  - **Educação Médica Inovadora**: Changes traditional medical teaching methodology for professionals and patients.
  - **Personalização Adaptativa**: Adapts to communicative profiles (long/deep vs. direct/focused conversations).
  - **Relatórios Médicos Integrais**: Generates detailed clinical, emotional, and life summaries for partner doctors.
- **Sistema de Consulta Empática**: Conversational responses that deepen and investigate, validate feelings, explore life context, and analyze symptoms, emotions, and personal history integrally.
- **Core Functionality**: Intelligent cross-search allowing natural language queries, integrated analysis from three simultaneous databases, and contextual suggestions for sub-searches.
- **AI Capabilities**: Specialized AI for cross-analysis, semantic analysis, contextual suggestions, automatic detection of common medical errors, and intelligent contextual chat that reads user notes and cross-references data. The Dr. Cannabis AI avatar is interactive and controls system activation.
- **Audio Features**: Simulated mouth animation with active speech detection (isAvatarSpeaking), Text-to-Speech optimized for medical content.
- **Search Interface Auto-Activation**: Searches automatically activate the Dr. AI (isDrAIActive) showing all chat, exploration, and study options.
- **Fluxo Completo Implementado**: Full Patient→Medical Doctor→Platform→Admin flow documented and functional, with a continuous learning system (daily/weekly/monthly) to generate scientific knowledge automatically.
- **Assistente de Estudos Científicos**: Integrated with full functionalities including real-time analytics and mini calendar. Interface allows generating complete studies, improving drafts, and continuing with AI.

## External Dependencies
- **Database**: Supabase PostgreSQL (primary for all users in production), fallback local para desenvolvimento (admin credentials: phpg69@gmail.com / n6n7n8N9!hours).
- **UI Components**: Radix UI primitives, Lucide React for icons.
- **3D Libraries**: Three.js, @react-three/fiber, @react-three/drei.
- **Development Tools**: Replit-specific plugins, ESBuild, PostCSS with Autoprefixer.
- **APIs**: PubMed, ClinicalTrials.gov, ANVISA, ElevenLabs (for voice synthesis), ft:gpt-3.5-turbo-0125:personal:fine-tuning-noa-esperanza-avaliacao-inicial-dez-ex-jsonl:BR0W02VP (NOA ESPERANÇA custom model).