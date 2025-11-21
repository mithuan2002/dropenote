# Dropnote - E-commerce Campaign Platform

## Overview

A Progressive Web Application (PWA) for managing e-commerce promo campaigns without website integration. The system enables e-commerce brands to create hosted campaign pages with promo codes, allowing customers to enter their details and unlock discounted checkout links. Built as a mobile-first application, it serves two distinct user types: brands who manage campaigns and customers who submit promo codes for discounts.

## Recent Changes (November 21, 2025)

**Platform Pivot Complete:**
- Migrated from influencer-focused coupon distribution to e-commerce brand campaign platform
- Changed from unique-code-per-customer to single-promo-code-per-campaign model
- Campaigns now have hosted public pages at `/c/:slug` requiring no authentication
- Customer submissions tracked with promo code validation
- Fixed critical bug: corrected `apiRequest()` function calls to use proper signature `apiRequest(method, url, data)` instead of object pattern

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching

**UI Framework:**
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS with custom design system configuration
- Design inspired by productivity tools (Linear, Notion) with Stripe's clarity principles
- Custom color system using CSS variables for theming
- Typography: Inter for UI text, JetBrains Mono for coupon codes

**Component Organization:**
- Reusable UI components in `client/src/components/ui/`
- Feature components in `client/src/components/`
- Page components in `client/src/pages/`
- Path aliases configured for clean imports (@/, @shared/)

**State Management Approach:**
- Server state: TanStack Query with infinite stale time (manual invalidation)
- Client state: React hooks and component state
- No global state management library (Redux/Zustand) needed for this MVP
- Query client configured with conservative refetch policies for performance

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Development mode uses Vite middleware for HMR
- Production builds bundle server code with esbuild

**Data Layer:**
- Drizzle ORM for type-safe database operations
- PostgreSQL database (configured via DATABASE_URL environment variable)
- Neon serverless PostgreSQL driver (@neondatabase/serverless)
- Schema defined in `shared/schema.ts` with Zod validation integration

**Database Schema:**
- `campaigns` table: Campaign metadata including name, slug, promoCode, discount percentage, checkout URLs (discounted and normal), expiration date
- `customer_submissions` table: Customer entries with name, WhatsApp number, promo code entered, and validation status
- `users` table: Brand accounts with role-based access (role: 'brand')
- `redemptions` table: Redemption events tracking purchase amounts
- UUID primary keys with PostgreSQL's gen_random_uuid()

**Storage Abstraction:**
- Interface-based storage design (`IStorage` in `server/storage.ts`)
- In-memory implementation (`MemStorage`) for development/testing
- Design allows easy swap to database implementation without changing route handlers

**API Design:**
- RESTful endpoints under `/api` prefix
- Request/response logging middleware for debugging
- Zod schema validation for all incoming data
- Consistent error handling with appropriate HTTP status codes

### Progressive Web App Features

**PWA Configuration:**
- Service worker (`public/sw.js`) for offline caching
- Manifest file (`public/manifest.json`) for installability
- Cache-first strategy for static assets
- Mobile-optimized viewport and touch targets

**Offline Strategy:**
- Essential UI assets cached on install
- Network-first for API calls with fallback to cache
- Visual feedback for offline state (design guidelines specify this requirement)

### Authentication & Authorization

**Current State:**
- No authentication system implemented in MVP
- Session management infrastructure exists (express-session with connect-pg-simple)
- Future-ready architecture for adding auth without major refactoring

### Design System Principles

**Layout System:**
- Mobile-first responsive design
- Tailwind spacing primitives (2, 4, 6, 8, 12 units)
- Maximum width containers (max-w-4xl) for desktop readability
- Single column mobile, multi-column desktop where appropriate

**Interaction Design:**
- Speed-first: Optimized for quick task completion
- Role clarity: Distinct visual hierarchy per user type
- Trust through simplicity: Clean, professional interface
- Large touch targets for mobile (min-h-32 for cards)

**Color System:**
- CSS custom properties for dynamic theming
- Separate light/dark mode support
- Elevation system using transparent black overlays
- Border colors computed programmatically for consistency

## External Dependencies

### Third-Party Libraries

**UI Components:**
- Radix UI primitives for accessible, unstyled components
- Lucide React for icon system
- date-fns for date manipulation
- embla-carousel-react for carousels (if needed)
- cmdk for command palette patterns

**Form Management:**
- React Hook Form for performant form handling
- Zod for runtime schema validation
- @hookform/resolvers for RHF + Zod integration

**Build & Development:**
- Vite with React plugin and runtime error overlay
- Replit-specific plugins for development environment
- esbuild for production server bundling
- PostCSS with Tailwind and Autoprefixer

### External Services

**Database:**
- PostgreSQL database (hosted service expected, likely Neon)
- Connection via DATABASE_URL environment variable
- Drizzle Kit for schema migrations

**Hosting Assumptions:**
- Designed for Replit deployment
- Environment variables: DATABASE_URL (required)
- Node.js runtime environment
- Static file serving for built frontend

### Development Tools

**Type Safety:**
- TypeScript in strict mode
- Shared types between client/server via `shared/` directory
- Drizzle schema inference for type-safe queries

**Code Quality:**
- ESM modules throughout (type: "module" in package.json)
- Path aliases for clean imports
- Incremental TypeScript builds for performance