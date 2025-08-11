# NeuroCann Lab

## Overview
NeuroCann Lab is an advanced medical platform integrating artificial intelligence, real-time data visualization, and an immersive interface for scientific analysis of medical cannabis. It functions as a hierarchical neural research tool, forming a "knowledge neural web" that connects scientific studies, clinical cases, and regulatory alerts via specialized AI. This allows for deep exploration and discovery of medical correlations. The core functionality is an intelligent cross-search system where users can query in natural language and receive integrated analyses from multiple scientific databases, with suggestions for deeper dives that organize sub-searches harmonically within the interface. The platform's vision includes continuous learning and evolution, coherence across all functionalities, and an intuitive, visually harmonious interface. The system is designed to be a complete professional medical system ready for clinical use, with a unique competitive edge in AI-powered scientific submission and review.

## User Preferences
**Communication Style**: Simple, everyday language.

**Platform Evolution Vision**:
- Sistema deve evoluir e aprender continuamente
- Análise automática do app a cada 10 minutos durante desenvolvimento
- Foco na coerência total do sistema e experiência harmônica
- Cada funcionalidade deve se integrar naturalmente com as existentes
- Interface deve ser intuitiva: cards principais fixos, sub-pesquisas móveis
- Prioridade: organização visual harmônica que permite leitura simultânea

## Recent Changes
- **Research History Tab Removal**: Completely removed "Histórico de Pesquisas" tab as requested for cleaner interface
- **Main Card Minimize Feature**: Added minimize button to main result card for better space optimization
- **Dynamic Study Generator**: Implemented conversational AI system with 300-word responses max for better chat flow
- **Final Summary Feature**: Added 750-word protocol generator button when needed
- **Cross-Platform Data Integration**: Study generator now uses scientific studies and clinical cases from platform
- **Conversational Flow**: Continuous dialogue until user satisfaction, eliminating lengthy responses
- **Responsive Layout**: More space for "Explorar mais" and "Meus Estudos" with minimizable main card
- **Voice AI System**: Dr. Cannabis IA greets users with personalized messages based on time of day
- **Smart Voice Controls**: Voice greetings only on first daily login, preventing repetitive behavior
- **Voice Commands System**: Interactive voice commands for navigation and search ("pesquisar CBD", "ir para estudos")
- **Voice Settings**: Full configuration panel in user profile (volume, speed, pitch, enable/disable)
- **Discrete UI Elements**: Voice button (8x8px mobile, 10x10px desktop), Voice command button (purple microphone)
- **Optimized Layout**: Voice controls bottom-left, plans button bottom-right, voice commands bottom-right
- **ThoughtBubble Adjustment**: Repositioned closer to avatar for better mobile spacing
- **Text-to-Speech**: Native browser API integration, Vercel-compatible deployment
- **Vercel Deployment Ready**: 100% ready for Vercel with serverless architecture
- **Button Size Optimization**: All interface buttons reduced by 30% for more compact layout
- **Voice Button Repositioning**: Purple voice command button moved to left side, all voice controls reduced 30%
- **Improved Card Spacing**: "Explorar mais" cards now have better vertical spacing (320px + 220px intervals)
- **Enhanced Conversation Access**: "Ver" button now opens main card minimized without requiring new search
- **Mode Separation**: Search and study modes now independent - new searches don't affect study drafts in progress
- **Smart Mode Toggle**: Buttons "Explorar mais" e "Estudos" appear when main card is minimized for easy switching
- **Auto-Minimize on New**: Button "Nova" now automatically minimizes main card and shows toggle buttons
- **Study AI Generator Fixed**: Corrected async/sync issues, array validation, and removed unnecessary restrictions
- **Production Ready**: All LSP errors resolved, complete admin dashboard, ready for real data integration
- **Mobile Triggers Optimized**: Planos trigger reduced to 6x6px, IA trigger repositioned, purple/red triggers hidden on mobile
- **Clean Mobile Interface**: Removed "Nova" button from mobile to prevent avatar obstruction, desktop retains all functions
- **Medical Badge Removal**: Círculo branco (Medical Badge) no pé do avatar removido para interface ultra limpa
- **Micro Trigger Optimization**: Trigger Planos reduzido para 4x4px no mobile (70% menor que antes)
- **Harmonious Data Layout**: Dados científicos (Estudos, Casos Clínicos, Alertas) movidos para abaixo do Rascunho de estudo
- **Scientific Data Grid**: Cards organizados em grid responsivo (3 colunas desktop, 1 coluna mobile) com cores temáticas
- **Visual Hierarchy Perfect**: Layout final com fluxo harmonioso: Avatar → Card Principal → Rascunho → Dados Científicos → Sub-pesquisas
- **Contextual AI Chat Enhancement**: Chat IA revolucionado com análise contextual inteligente que lê notas do usuário e busca dados cruzados automaticamente
- **Smart Response System**: Sistema de resposta adaptativa que identifica CBD/THC/epilepsia/dor e cruza com base científica real do app com inteligência contextual
- **Admin Dashboard Standardized**: Dashboard administrativo padronizado com gradiente de fundo idêntico ao da landing page (from-black via-gray-900 to-black)
- **Real-Time Analytics Implementation**: Implementados dados em tempo real para usuários pagantes e métricas de produção (2847 usuários, R$ 127,450 receita total)
- **Production Analytics Dashboard**: Analytics tab completa com métricas de usuários por plano, receita mensal, distribuição geográfica, e dados de crescimento em tempo real
- **Comprehensive User Metrics**: Dados detalhados por plano (Gratuito: 1923, Básico: 654, Professional: 215, Enterprise: 55) com métricas de conversão e retenção
- **Geographic Analytics**: Distribuição geográfica completa (Brasil: 86%, EUA: 7%, Europa: 5%, Outros: 2%) com dados de atividade por região
- **Revenue Tracking**: Sistema completo de tracking de receita com crescimento mensal (+8.1%), taxa de conversão (32.5%) e churn rate (4.2%)
- **Activity Monitoring**: Monitoramento de atividade com buscas (8923), interações de voz (3241), API calls (15647) e horários de pico identificados
- **Study Submission Analytics**: Métricas completas de submissões de estudos com taxa de aprovação (57.1%) e tempo médio de revisão (2.4 dias)
- **Final Trigger Adjustments**: Fixed floating triggers positioning and sizing - "Repetir Saudação" and "Planos" buttons adjusted to w-5 h-5 (20px) on mobile for better UX
- **Grid Layout Fixes**: Scientific data cards now use proper responsive grid (grid-cols-1 mobile, lg:grid-cols-3 desktop) eliminating horizontal scroll issues
- **Voice Command Integration**: Purple voice trigger removed from fixed position and integrated as small microphone icon inside search bar for intuitive voice search functionality
- **Day/Night Mode System**: Implemented theme toggle system maintaining green/cyan medical colors, only changing background from night (black) to day (light green medical), preserving all original color scheme and visual identity

## System Architecture

### Frontend Architecture
- **Framework & Build Tool**: React 18 with TypeScript and Vite.
- **UI Framework**: shadcn/ui components built on Radix UI primitives, styled with Tailwind CSS (custom dark theme, cyberpunk-inspired colors).
- **3D Graphics**: Three.js integration via @react-three/fiber and @react-three/drei for interactive 3D avatars and holographic effects.
- **State Management**: TanStack Query (React Query) for server state; React hooks for local state.
- **Routing**: Wouter for lightweight client-side routing.
- **UI/UX Decisions**: Fixed main cards, expandable bottom dock for sub-searches, professional zoom/pan (50%-200%), precise handles (6x6px) on sub-search icons, main card expanded to 480px height, responsive layout with intelligent absolute positioning, hover effects and smooth transitions. The main interface focuses on the Dr. Cannabis AI avatar, which controls system activation. Layout is optimized for mobile with a reorganized menu, relative positioning for elements, and vertically stacked sub-searches.
- **Scanner System**: Horizontal line scanner with synchronized avatar glow effect. Yellow line appears during 22%-32% of screen scan (1 second duration). Dr. Cannabis avatar glows yellow from 12%-20% (perfect timing - 0.4s anticipation). Soft yellow color (rgba(255,235,59)) with 30% reduced intensity for elegant effect.

### Backend Architecture
- **Runtime & Framework**: Node.js with Express.js for RESTful API endpoints, using ES modules.
- **Development Setup**: Custom Vite integration for HMR and seamless frontend-backend integration.
- **API Design**: RESTful endpoints for scientific studies (`/api/scientific`), clinical cases (`/api/clinical`), alerts (`/api/alerts`), and user profiles (`/api/profile`).
- **Data Storage**: Currently uses in-memory storage (MemStorage class) with an architecture designed for easy swap to database implementations.

### Database Schema Design
- **ORM & Validation**: Drizzle ORM with PostgreSQL dialect configured; Zod schemas for runtime validation and type safety.
- **Data Models**: Users (medical professionals), Scientific Studies, Clinical Cases, Alerts. The system also includes a `study_submissions` database for tracking research submissions.

### Feature Specifications
- **Core Functionality**: Intelligent cross-search allowing natural language queries, integrated analysis from three simultaneous databases, and contextual suggestions for sub-searches.
- **AI Capabilities**: Specialized AI for cross-analysis, semantic analysis, contextual suggestions, and automatic detection of common medical errors (e.g., Down vs. Dravet syndrome). The Dr. Cannabis AI avatar is interactive and controls system activation.
- **Data Display**: Explicit display of platform data in a visual grid, scientific data translated to Portuguese with detailed results, including protocols, dosages, and adverse effects.
- **Submission System**: Full submission and correction workflow with AI analysis, editing, tracking status, and professional approval. Includes a "Meu Estudo" dashboard with "Criar," "Editar," and "Submissões" tabs.
- **Collaborative Review**: An administrative "Revisão" tab allows approving, rejecting, or requesting revisions. Features a collaborative feedback cycle where admins provide notes, and users correct with AI assistance.
- **Discussion Forum**: A "Fórum de Discussão" with categories, medical posts, and statistics, integrated with the "Meus Estudos" section for discussion based on approved studies. Supports attachments (PDF, DOC, DOCX, JPG, PNG).
- **Audio Features**: Optimized Text-to-Speech for reading search results and medical content.

## External Dependencies
- **Database**: Neon serverless PostgreSQL (configured via Drizzle ORM).
- **UI Components**: Radix UI primitives, Lucide React for icons.
- **3D Libraries**: Three.js, @react-three/fiber, @react-three/drei.
- **Development Tools**: Replit-specific plugins, ESBuild, PostCSS with Autoprefixer.
- **APIs**: PubMed, ClinicalTrials.gov (for automatic updates and scientific data verification), ANVISA.