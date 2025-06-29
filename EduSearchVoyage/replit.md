# EduSearch - Futuristic Educational Search Platform

## Overview

EduSearch is a modern, full-stack educational search platform that combines advanced search capabilities with voice controls and intelligent bookmarking. The application provides a futuristic interface for discovering educational content across various sources with AI-powered assistance through the Omnidimension voice widget.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom futuristic theme using CSS variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under `/api` prefix
- **Development**: Hot module replacement with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless connection (@neondatabase/serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for development/demo purposes

## Key Components

### Search System
- **Google Custom Search Integration**: Uses Google Custom Search API for educational content discovery
- **Advanced Filtering**: Support for source filtering, date restrictions, and educational level targeting
- **Voice Search**: Integration with Omnidimension voice widget for hands-free search
- **Search History**: Persistent tracking of user search queries and filters

### Bookmark Management
- **Categorized Bookmarks**: Organized bookmark system with custom categories
- **Rich Metadata**: Stores title, URL, description, snippet, and source information
- **Quick Actions**: Easy bookmark creation from search results with toast notifications

### Voice Integration
- **Omnidimension Widget**: Third-party voice recognition service integration
- **Fallback Support**: Browser-native speech recognition as backup
- **Voice Commands**: Voice-activated search and navigation capabilities

### User Interface
- **Futuristic Theme**: Dark mode with neon accent colors (cyan, purple, emerald)
- **Glass Morphism Effects**: Translucent cards with backdrop blur effects
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

1. **Search Process**:
   - User enters query through search interface or voice commands
   - Frontend validates and sends request to `/api/search` endpoint
   - Backend constructs Google Custom Search API request with filters
   - Results are cached and returned to frontend
   - TanStack Query manages caching and background refetching

2. **Bookmark Flow**:
   - User clicks bookmark button on search result
   - Frontend sends bookmark data to `/api/bookmarks` endpoint
   - Backend validates data using Zod schemas and stores in database
   - UI updates immediately with optimistic updates
   - Success/error feedback through toast notifications

3. **Voice Recognition**:
   - Voice widget captures audio input
   - Converts speech to text using external service
   - Triggers search with recognized query
   - Fallback to browser APIs if widget unavailable

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm & drizzle-kit**: Type-safe ORM and schema management
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **zod**: Runtime type validation and schema definition

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for Node.js
- **@replit/vite-plugin-***: Replit-specific development tools

### External Services
- **Google Custom Search API**: Educational content search
- **Omnidimension Voice Widget**: Voice recognition and commands
- **Neon Database**: Serverless PostgreSQL hosting

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite middleware integration with Express server
- **Environment Variables**: Database URL and API keys through `.env`
- **Development Banner**: Replit development indicators
- **Error Overlay**: Runtime error modal for debugging

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Process Management**: Single Node.js process handles both frontend and API

### Database Management
- **Schema Deployment**: `drizzle-kit push` for schema synchronization
- **Migrations**: Stored in `./migrations` directory
- **Connection Pooling**: Handled by Neon serverless driver

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```