# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs on port 8080)
- **Build**: `npm run build` (production build) or `npm run build:dev` (development build)
- **Linting**: `npm run lint`
- **Preview**: `npm run preview`
- **Dependencies**: `npm i`

## Architecture Overview

This is a React + TypeScript application built with Vite, focusing on automotive repair shop management (karrosserie). The application uses a modular architecture with clear separation of concerns.

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, React Context for authentication
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router DOM with protected routes
- **Forms**: React Hook Form with Zod validation
- **Mobile**: Capacitor for mobile app deployment

### Project Structure
```
src/
├── components/           # Reusable UI components organized by domain
│   ├── accounting/      # Financial management components
│   ├── auth/           # Authentication forms and components  
│   ├── client/         # Client management components
│   ├── cessions/       # Vehicle transfer documents
│   ├── credits/        # Credit note management
│   ├── ai-assistant/   # AI automation features
│   └── router/         # Route configuration and protection
├── pages/              # Page-level components
├── hooks/              # Custom React hooks for data and logic
├── services/           # API services and business logic
│   ├── supabase/       # Database operations organized by domain
│   ├── pdf/           # PDF generation services
│   └── api/           # External API integrations
├── contexts/           # React contexts (AuthContext)
├── routes/            # Route definitions organized by feature
├── lib/               # Utility functions
└── types/             # TypeScript type definitions
```

### Data Layer Architecture
- **Database**: Supabase with TypeScript client
- **Service Layer**: Domain-specific services in `src/services/supabase/` (clients.ts, invoices/, repair-orders/, etc.)
- **Data Fetching**: TanStack Query hooks in `src/hooks/` for caching and synchronization
- **Authentication**: Supabase Auth with custom AuthContext and profile management

### Key Architectural Patterns
- **Protected Routes**: All authenticated routes wrapped in ProtectedRoute component
- **Domain Organization**: Components and services organized by business domain (clients, invoices, repair orders, etc.)
- **Service Abstraction**: Business logic abstracted into service modules with separate queries/mutations
- **Hook-based Logic**: Custom hooks encapsulate data fetching, form state, and business logic
- **Component Composition**: Heavy use of shadcn/ui for consistent design system

### Authentication Flow
- Supabase Auth with email/password authentication
- AuthContext provides session, user, and profile state
- ProtectedRoute component handles route protection
- Profile system with company-based multi-tenancy

### State Management Strategy
- **Server State**: TanStack Query for API data with caching
- **Authentication State**: React Context with useAuthState hook
- **Form State**: React Hook Form with Zod validation schemas
- **UI State**: Local component state and prop drilling

### Key Business Domains
- **Clients & Vehicles**: Customer and vehicle management
- **Documents**: Quotes, invoices, repair orders, expertise reports
- **Financial**: Accounting, payments, credits, expenses
- **Fleet Management**: Vehicle fleet tracking and reservations
- **AI Assistant**: Automation and intelligent features
- **Messaging**: Communication and notifications

### Important Notes
- Uses `@` alias for src directory imports
- Components follow shadcn/ui patterns with Tailwind CSS
- Extensive use of TypeScript for type safety
- Mobile-responsive design with Capacitor for mobile deployment
- Multi-tenant architecture with company-based data isolation