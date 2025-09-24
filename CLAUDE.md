# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive body shop management application (Karrosserie Pro) built with React, TypeScript, and Supabase. The app manages vehicles, clients, invoices, quotes, repair orders, fleet operations, and various administrative tasks for automotive repair businesses.

**Key Technologies:**
- Vite + React 18 with TypeScript
- shadcn/ui component library built on Radix UI
- Tailwind CSS for styling
- Supabase for backend/database
- React Query for data fetching
- React Hook Form with Zod validation
- React Router for navigation
- React PDF for document generation
- Capacitor for mobile app deployment

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

### Directory Structure

```
src/
├── components/          # Reusable UI components organized by feature
│   ├── ui/             # shadcn/ui components
│   ├── accounting/     # Financial management components
│   ├── auth/           # Authentication components
│   ├── client/         # Client management
│   ├── credits/        # Credit notes
│   ├── invoices/       # Invoice management
│   ├── quotes/         # Quote generation
│   ├── repair-orders/  # Work orders
│   ├── fleet/          # Fleet management
│   └── shared/         # Shared components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and business logic services
│   └── supabase/       # Supabase service layers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Shared libraries and utilities
```

### Data Layer

The app uses **Supabase** as the backend with:
- Authentication system integrated throughout
- Real-time subscriptions for live data updates
- File storage for documents and images
- PostgreSQL database with typed TypeScript interfaces

Key service patterns:
- Services organized in `src/services/supabase/` by feature
- Custom hooks in `src/hooks/` for data fetching and state management
- React Query for caching and synchronization

### Form Handling

Forms follow consistent patterns:
- **React Hook Form** with **Zod** schema validation
- Form components typically split into multiple files for complex forms
- Validation schemas in separate files (e.g., `validation.ts`)
- Custom hooks for form logic (e.g., `useInvoiceFormLogic.ts`)

### Document Generation

The app generates PDFs for business documents:
- Uses `@react-pdf/renderer` for PDF generation
- Template system for different document layouts
- Email integration for sending documents

### State Management

- **React Query** for server state
- **React Context** for app-wide state (auth, confirmation dialogs)
- Local component state with React hooks
- Form state managed by React Hook Form

### Mobile Support

- **Capacitor** configuration for iOS/Android deployment
- Camera integration for document capture
- Responsive design with mobile-first approach

## Key Features

- **Client Management**: Full CRUD operations for clients and vehicles
- **Document Generation**: Quotes, invoices, repair orders, credit notes
- **Fleet Management**: Vehicle loans, returns, scheduling
- **Financial Tracking**: Accounting, expenses, payment management
- **Planning System**: Task scheduling and employee management
- **Multi-tenancy**: Company-based data isolation
- **Real-time Updates**: Live data synchronization across users

## Development Notes

- The app uses French localization (currency: EUR, date formats)
- All monetary values formatted with `formatCurrency()` utility
- Consistent error handling with toast notifications
- Image cropping and document upload functionality throughout
- AI assistant integration for automated tasks
- Comprehensive permission system based on user roles

## Important File Patterns

- Form components: `*Form.tsx` with corresponding hooks and validation
- Service layers: `src/services/supabase/*` organized by feature
- Type definitions: Database types auto-generated from Supabase
- Utilities: Feature-specific utilities in component directories