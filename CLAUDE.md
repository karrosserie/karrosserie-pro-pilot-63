# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- **Start development server**: `npm run dev` (runs on port 8080)
- **Build for production**: `npm run build`
- **Build for development**: `npm run build:dev`
- **Lint code**: `npm run lint`
- **Preview build**: `npm run preview`

### Dependencies
- **Install dependencies**: `npm i`

## Architecture Overview

This is a **React + TypeScript + Vite** application for a body shop management system (karrosserie/car body shop) with the following key characteristics:

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with animations
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Mobile**: Capacitor for mobile app deployment
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: @react-pdf/renderer, jspdf, pdf-lib

### Project Structure

#### Core Directories
- `src/components/` - Reusable UI components organized by domain
- `src/pages/` - Page-level components and route handlers
- `src/hooks/` - Custom React hooks for business logic
- `src/contexts/` - React contexts (primarily AuthContext)
- `src/lib/` - Utility functions and configurations
- `src/types/` - TypeScript type definitions
- `supabase/` - Database migrations and edge functions

#### Key Component Categories
- **Authentication**: Login, signup, password reset flows
- **Client Management**: Customer information, vehicles, documents
- **Document Management**: Quotes, invoices, repair orders, expertise reports, credits
- **Fleet Management**: Vehicle tracking, reservations, returns
- **Accounting**: Financial tracking, expenses, receipts
- **AI Assistant**: Automated business processes and intelligent features
- **Planning**: Employee scheduling and task management

### Database & Backend
- **Supabase PostgreSQL** with Row Level Security (RLS)
- **Edge Functions** for server-side logic (VIN decoding, document processing, etc.)
- **Real-time subscriptions** for live data updates
- **File storage** for documents and images

### Key Patterns

#### Component Organization
- Components are grouped by business domain (e.g., `components/invoices/`, `components/clients/`)
- Complex forms are broken into sub-components with dedicated hooks
- Modal components follow consistent naming: `*Dialog.tsx` or `*Modal.tsx`

#### Form Handling
- React Hook Form with Zod schemas for validation
- Custom hooks like `useInvoiceFormLogic` encapsulate complex form state
- Form data is often split into tabs/sections for better UX

#### State Management
- TanStack Query for all server state and caching
- React Context for authentication state
- Local state with useState/useReducer for UI state

#### Styling
- `cn()` utility function combines clsx and tailwind-merge
- French locale formatting for currency and numbers
- Responsive design with mobile-first approach

### Configuration
- **Path Aliases**: `@/*` maps to `src/*`
- **TypeScript**: Relaxed settings (noImplicitAny: false, strictNullChecks: false)
- **Vite**: Custom port 8080, SWC for fast compilation
- **Capacitor**: Configured for mobile deployment with camera permissions

### Development Notes
- French business domain (body shop/garage management)
- Currency formatting uses EUR with French locale
- Some TypeScript strictness disabled for faster development
- Extensive use of shadcn/ui component library
- Mobile-responsive design with dedicated mobile components