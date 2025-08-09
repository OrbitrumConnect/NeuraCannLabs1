# Cannabis Clinical Hub - Medical Platform

## Overview

Cannabis Clinical Hub is a full-stack web application designed as an advanced medical platform for analyzing scientific research, clinical cases, and discoveries in cannabis medicinal applications. The platform features an innovative 3D avatar interface, real-time data visualization, and a cyberpunk-inspired design aesthetic.

The application serves as a comprehensive hub for medical professionals to access scientific studies, review clinical cases, receive important alerts, and manage their profiles in an interactive and visually engaging environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**2025-08-09**: Implemented neural research tree expanding from Dr. Cannabis IA
- Research tree expands vertically from avatar with neural connection lines
- Main searches appear as expandable nodes connected to avatar via cyan neural lines
- Sub-searches branch from main nodes with purple neural connections  
- Each node expandable/collapsible to avoid interface overlap
- Visual hierarchy: main nodes (cyan) → sub-nodes (purple) with proper spacing
- Node management: close individual research threads, expand/collapse content
- Tree structure prevents interface overlap while maintaining research context
- Neural aesthetic matches avatar's "mind expansion" concept

**2025-08-09**: Removed duplicate VerdiData IA system
- Eliminated confusing dual chat systems that were causing user confusion
- Maintained only the functional "IA Cannabis" chat system
- Simplified codebase by removing redundant card systems and drag functionality
- Cleaner interface focusing on single, effective AI interaction

**2025-08-09**: Implemented sub-search system with lateral cards
- Added sub-search functionality at the end of VerdiData IA analysis
- Sub-search opens purple-themed lateral card on the right side of screen
- Main AI card automatically reduces width when sub-search is active
- Sub-search card is fully functional with same interactive elements as main analysis
- Card can be closed independently while maintaining main analysis
- Input field with Enter key support and dedicated search button
- Smooth animations and transitions between card states

**2025-08-09**: Improved AI response integration approach
- VerdiData AI now displays as integrated content section when expanded
- Only becomes draggable floating card when minimized
- Better space utilization and natural content flow
- Maintains all interactive features and smooth animations

**2025-08-09**: Implemented fully draggable AI response card system
- VerdiData AI card now fully draggable when minimized with smooth movement  
- Card opens below search area instead of top of screen
- Maintains single card instance - new searches update existing card content
- Position limits prevent card from moving outside screen boundaries
- Cursor changes to "move" when dragging minimized card
- Fixed positioning with proper header clearance (64px minimum top)
- Card remembers position when minimized and being moved around screen

**2025-08-08**: Added intelligent AI chat system integrated to search bar
- VerdiData AI responds to questions about scientific studies and clinical cases
- Chat mode toggle with real-time responses based on platform data
- Smart responses about dosages, efficacy, adverse effects, and regulations
- Interface improvements: removed cannabis icon, repositioned planets below search bar

## System Architecture

### Frontend Architecture

**Framework & Build Tool**: React 18 with TypeScript and Vite for fast development and optimized builds. The frontend uses modern React patterns with functional components and hooks.

**UI Framework**: shadcn/ui components built on Radix UI primitives, providing accessible and customizable components. Tailwind CSS handles styling with a custom dark theme featuring cyberpunk-inspired colors and effects.

**3D Graphics**: Three.js integration via @react-three/fiber and @react-three/drei for rendering interactive 3D avatars and holographic effects, creating an immersive user experience.

**State Management**: TanStack Query (React Query) for server state management, caching, and synchronization. Local state handled through React hooks.

**Routing**: Wouter for lightweight client-side routing with support for nested routes and dynamic sections.

### Backend Architecture

**Runtime & Framework**: Node.js with Express.js providing RESTful API endpoints. Uses ES modules throughout for modern JavaScript syntax.

**Development Setup**: Custom Vite integration for hot module replacement in development, with middleware mode for seamless frontend-backend integration.

**API Design**: RESTful endpoints following conventional patterns:
- Scientific studies: `/api/scientific`
- Clinical cases: `/api/clinical` 
- Alerts: `/api/alerts`
- User profiles: `/api/profile`

**Data Storage**: Currently uses in-memory storage (MemStorage class) with interfaces designed to easily swap to database implementations. Schema definitions use Drizzle ORM with Zod validation.

### Database Schema Design

**ORM & Validation**: Drizzle ORM with PostgreSQL dialect configured, though currently using in-memory storage. Zod schemas provide runtime validation and type safety.

**Data Models**:
- Users: Medical professionals with specialties and credentials
- Scientific Studies: Research papers with compounds, indications, and phases
- Clinical Cases: Patient cases with outcomes and doctor associations
- Alerts: Notifications with priority levels and read status

### External Dependencies

**Database**: Neon serverless PostgreSQL configured via Drizzle ORM (DATABASE_URL environment variable required)

**UI Components**: Extensive use of Radix UI primitives for accessibility and Lucide React for icons

**Development Tools**: 
- Replit-specific plugins for runtime error overlay and cartographer
- ESBuild for production builds
- PostCSS with Autoprefixer for CSS processing

**3D Libraries**: Three.js ecosystem including @react-three/fiber for React integration and @react-three/drei for additional 3D utilities

The architecture prioritizes modularity, type safety, and developer experience while maintaining the flexibility to scale into a production medical platform with real database integration and authentication systems.