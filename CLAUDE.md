# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Karrosserie Pro Pilot is a comprehensive management solution for auto body shops and garages. This is a modern React/TypeScript web application built with Vite that handles the complete business workflow from customer intake to billing, including vehicle management, document generation, accounting, and AI-powered automation.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (runs on http://localhost:8080)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Testing
No test scripts are currently configured in package.json. Check with the team about testing procedures.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components + Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF, @react-pdf/renderer, pdf-lib
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Architecture

### Application Structure

The app follows a modular feature-based architecture:

```
src/
├── components/           # Feature-based component modules
│   ├── auth/            # Authentication components
│   ├── clients/         # Client management
│   ├── vehicles/        # Vehicle management  
│   ├── quotes/          # Quote generation
│   ├── invoices/        # Invoice management
│   ├── repair-orders/   # Repair order workflow
│   ├── fleet/           # Courtesy vehicle management
│   ├── cessions/        # Insurance claim assignments
│   ├── accounting/      # Financial management
│   ├── ai-assistant/    # AI automation features
│   └── ui/              # Reusable UI components (shadcn/ui)
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── routes/              # Route configuration
├── services/            # External service integrations
├── contexts/            # React contexts
└── utils/               # Utility functions
```

### Key Architectural Patterns

1. **Supabase Integration**: All data operations go through Supabase client with RLS (Row Level Security)
2. **Component Organization**: Features are self-contained with their own forms, hooks, and utilities
3. **Route Structure**: Modular route definitions split by feature area
4. **State Management**: Server state via TanStack Query, local state via React hooks
5. **Form Handling**: React Hook Form with Zod schemas for validation

### Core Workflows

The application manages these main business workflows:

1. **Customer/Vehicle Intake**: Client registration → Vehicle registration → Document upload
2. **Quote Generation**: Expertise report import → Quote creation → Customer approval
3. **Work Order Management**: Quote conversion → Work planning → Progress tracking
4. **Billing**: Invoice generation → Payment tracking → Accounting integration
5. **Insurance Claims**: Cession creation → Claim submission → Payment tracking
6. **Fleet Management**: Courtesy vehicle loans → Damage assessment → Returns

## Database Schema

The app uses Supabase with extensive PostgreSQL schema including:
- Companies, clients, vehicles, employees
- Documents (quotes, invoices, repair orders, credits, cessions)
- Financial data (accounts, receipts, expenses)
- Fleet management (reservations, returns, violations)
- Extensive migration history for schema evolution

## Key Development Guidelines

### Component Patterns
- Use functional components with hooks
- Follow feature-based folder structure
- Forms use React Hook Form + Zod validation
- PDF generation for all business documents
- Comprehensive error handling and loading states

### Data Fetching
- Use TanStack Query for all server state
- Custom hooks in `/hooks/` directory for data operations
- Supabase service functions in `/services/supabase/`

### Styling
- Tailwind CSS for all styling
- shadcn/ui components for consistent design system
- Responsive design with mobile-first approach

### Security
- Supabase RLS policies handle data access control
- Client-side validation with server-side enforcement
- Token-based authentication with role-based permissions

### PDF Generation
Documents (quotes, invoices, etc.) are generated as PDFs using multiple libraries:
- Template system with customizable layouts
- Automatic calculations and formatting
- Email integration for document delivery

## Business Domain Knowledge

Understanding the auto body shop workflow is crucial:
- **Expertise Reports**: Insurance assessments imported via AI
- **Quotes/Devis**: Estimates for repair work
- **Repair Orders/Ordres**: Work instructions and tracking
- **Cessions**: Transferring payment responsibility to insurance companies
- **Fleet Management**: Courtesy vehicles lent to customers during repairs

The application supports the complete French business context including VAT calculations, SIRET numbers, and regulatory compliance.

## File Upload and Storage

- Uses Supabase Storage for file management
- Supports images, PDFs, and document uploads
- Image cropping and processing capabilities
- Document analysis via AI for data extraction

## Important Notes

- Development server runs on port 8080, not the default 5173
- No TypeScript checking in build process - handled by IDE/editor
- Extensive use of form validation throughout
- Multi-tenant architecture with company-based data isolation