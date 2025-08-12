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

## System Architecture

### Frontend Architecture
- **Framework & Build Tool**: React 18 with TypeScript and Vite.
- **UI Framework**: shadcn/ui components built on Radix UI primitives, styled with Tailwind CSS (custom dark theme, cyberpunk-inspired colors).
- **3D Graphics**: Three.js integration via @react-three/fiber and @react-three/drei for interactive 3D avatars and holographic effects.
- **State Management**: TanStack Query (React Query) for server state; React hooks for local state.
- **Routing**: Wouter for lightweight client-side routing.
- **UI/UX Decisions**: Fixed main cards, expandable bottom dock for sub-searches, professional zoom/pan (50%-200%), precise handles (6x6px) on sub-search icons, main card expanded to 480px height, responsive layout with intelligent absolute positioning, hover effects and smooth transitions. The main interface focuses on the Dr. Cannabis AI avatar, which controls system activation. Layout is optimized for mobile with a reorganized menu, relative positioning for elements, and vertically stacked sub-searches.
- **Scanner System**: Horizontal line scanner with synchronized avatar glow effect. Yellow line appears during 22%-32% of screen scan (1 second duration). Dr. Cannabis avatar glows yellow from 12%-20% (perfect timing - 0.4s anticipation). Soft yellow color (rgba(255,235,59)) with 30% reduced intensity for elegant effect.
- **Design Principles**: Consistent brand identity with a permanent night mode (dark medical interface) and green as the primary medical color across all UI elements. Standardized dashboard dimensions for visual harmony.

### Backend Architecture
- **Runtime & Framework**: Node.js with Express.js for RESTful API endpoints, using ES modules.
- **Development Setup**: Custom Vite integration for HMR and seamless frontend-backend integration.
- **API Design**: RESTful endpoints for scientific studies (`/api/scientific`), clinical cases (`/api/clinical`), alerts (`/api/alerts`), and user profiles (`/api/profile`).
- **Data Storage**: Currently uses in-memory storage (MemStorage class) with an architecture designed for easy swap to database implementations.

### Database Schema Design
- **ORM & Validation**: Drizzle ORM with PostgreSQL dialect configured; Zod schemas for runtime validation and type safety.
- **Data Models**: Users (medical professionals), Scientific Studies, Clinical Cases, Alerts. The system also includes a `study_submissions` database for tracking research submissions.

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

## External Dependencies
- **Database**: Neon serverless PostgreSQL (configured via Drizzle ORM).
- **UI Components**: Radix UI primitives, Lucide React for icons.
- **3D Libraries**: Three.js, @react-three/fiber, @react-three/drei.
- **Development Tools**: Replit-specific plugins, ESBuild, PostCSS with Autoprefixer.
- **APIs**: PubMed, ClinicalTrials.gov, ANVISA.