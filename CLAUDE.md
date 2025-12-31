# CLAUDE.md - Vieraskirja Project Documentation

## Project Overview

**Vieraskirja** (Finnish for "Guestbook") is a modern fullstack web application built with the T3 Stack. It serves as a guestbook where users can leave their name and messages, which are stored in a database and displayed in real-time.

## Features

✅ **Implemented:**
- **Form Validation & Error Handling** - Client-side validation with Zod, real-time error feedback, character count, and accessibility features
- **Pagination UI** - Infinite scroll with cursor-based pagination, "Load more" button, and smooth loading states
- **Production Database** - PostgreSQL support with complete migration setup
- **Modern UI/UX** - Gradient backgrounds, smooth animations, responsive design, and Finnish language support
- **Type Safety** - End-to-end type safety with tRPC and TypeScript

## Tech Stack (T3 Stack)

- **Framework:** Next.js 15.2.3 (App Router)
- **Language:** TypeScript 5.8.2
- **Styling:** Tailwind CSS 4.0.15
- **API Layer:** tRPC 11.0.0 (End-to-end type safety)
- **Database & ORM:** Prisma 6.6.0
- **Validation:** Zod 3.24.2
- **State Management:** TanStack React Query 5.69.0

## Project Architecture

This is a Next.js App Router application with full-stack capabilities:

```
vieraskirja/
├── src/
│   ├── app/                    # Next.js App Router pages and components
│   │   ├── _components/        # Shared components
│   │   │   └── post.tsx       # Post component
│   │   ├── api/trpc/          # tRPC API endpoint
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── server/                 # Backend logic
│   │   ├── api/
│   │   │   ├── routers/       # tRPC routers
│   │   │   │   └── post.ts    # Post router (CRUD operations)
│   │   │   ├── root.ts        # Root router
│   │   │   └── trpc.ts        # tRPC configuration
│   │   └── db.ts              # Prisma client singleton
│   ├── trpc/                   # tRPC client configuration
│   │   ├── query-client.ts
│   │   ├── react.tsx
│   │   └── server.ts
│   └── env.js                  # Environment variable validation
├── prisma/
│   └── schema.prisma          # Database schema
├── generated/prisma/          # Generated Prisma client
└── public/                    # Static assets
```

## Database Schema

### Post Model
Located in `prisma/schema.prisma`

```prisma
model Post {
    id        Int      @id @default(autoincrement())
    name      String
    message   String   @default("")
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@index([name])
}
```

**Database Provider:** PostgreSQL (recommended for production)

**Generated Client Location:** `generated/prisma` (custom output path)

**Note:** For local development, you can use PostgreSQL locally or switch to SQLite by changing the `provider` in `prisma/schema.prisma` to `"sqlite"` and updating the `DATABASE_URL` in `.env`.

## API Endpoints (tRPC)

All API logic is in `src/server/api/routers/post.ts`

### Available Procedures

1. **hello** (query)
   - Input: `{ text: string }`
   - Output: `{ greeting: string }`
   - Purpose: Demo endpoint

2. **create** (mutation)
   - Input: `{ name: string, message: string }` (both min length: 1, message max: 500)
   - Creates a new post entry with name and message
   - Returns: Created post object

3. **getLatest** (query)
   - No input required
   - Returns: Latest post (by createdAt) or null

4. **getAll** (query)
   - Input: `{ limit?: number (1-100, default: 10), cursor?: number }`
   - Returns: Paginated posts with cursor-based pagination
   - Output: `{ posts: Post[], nextCursor?: number }`
   - Posts are ordered by createdAt descending

### Adding New Endpoints

To add new tRPC procedures:
1. Open `src/server/api/routers/post.ts`
2. Add new procedures to the `postRouter`
3. Use `publicProcedure` for unauthenticated endpoints
4. Use `.input(z.object({ ... }))` for validation
5. Use `.query()` for read operations, `.mutation()` for write operations

## Development Workflow

### Environment Setup

1. **Environment Variables** (`.env`):

   Create a `.env` file in the root directory (copy from `.env.example`):

   **PostgreSQL (Production):**
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ```

   **Examples:**
   - Local PostgreSQL: `DATABASE_URL="postgresql://postgres:password@localhost:5432/vieraskirja"`
   - Vercel Postgres: `DATABASE_URL="postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"`

   **SQLite (Development only):**
   ```
   DATABASE_URL="file:./db.sqlite"
   ```
   Note: If using SQLite, change `provider` in `prisma/schema.prisma` to `"sqlite"`

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Initialize Database:**
   ```bash
   npx prisma db push
   ```

   Or for production with migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Available Scripts

- `npm run dev` - Start development server with Turbo
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run check` - Run both lint and typecheck
- `npm run format:check` - Check code formatting
- `npm run format:write` - Format code with Prettier
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Deploy migrations

### Development Server

```bash
npm run dev
```
App runs at: http://localhost:3000

## Code Patterns and Conventions

### tRPC Usage

**Server-side (React Server Components):**
```typescript
import { api } from "~/trpc/server";

const post = await api.post.getLatest();
```

**Client-side (React Client Components):**
```typescript
'use client';
import { api } from "~/trpc/react";

const { data, isLoading } = api.post.getLatest.useQuery();
const createPost = api.post.create.useMutation();
```

### Database Access

Always use the Prisma client from `src/server/db.ts`:
```typescript
import { db } from "~/server/db";

const posts = await db.post.findMany();
```

### Validation

Use Zod schemas for all input validation:
```typescript
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  message: z.string().max(500),
});
```

## Common Tasks

### Adding a New Field to Post Model

1. Update `prisma/schema.prisma`:
   ```prisma
   model Post {
     id        Int      @id @default(autoincrement())
     name      String
     message   String
     email     String   // New field example
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. Push changes:
   ```bash
   npx prisma db push
   ```

3. Update tRPC router input validation in `src/server/api/routers/post.ts`

4. Update UI components in `src/app/_components/`

### Creating a New tRPC Router

1. Create new file: `src/server/api/routers/yourRouter.ts`
2. Define router with procedures
3. Import and add to `src/server/api/root.ts`:
   ```typescript
   import { yourRouter } from "./routers/yourRouter";

   export const appRouter = createTRPCRouter({
     post: postRouter,
     your: yourRouter,
   });
   ```

### Deployment

**Vercel (Recommended):**
1. Push code to GitHub
2. Import project in Vercel
3. Set `DATABASE_URL` environment variable
4. Deploy

**Docker:**
1. Ensure `next.config.js` has `output: "standalone"`
2. Build: `docker build -t vieraskirja .`
3. Run: `docker run -p 3000:3000 -e DATABASE_URL="..." vieraskirja`

## Key Files Reference

- `src/server/api/routers/post.ts` - Backend API logic
- `src/app/page.tsx` - Home page
- `src/app/_components/post.tsx` - Post component
- `src/server/db.ts` - Database client
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables
- `package.json` - Dependencies and scripts

## Notes for AI Assistants

- This project uses Next.js App Router (not Pages Router)
- All database operations should go through Prisma
- All API endpoints should be tRPC procedures
- Client/Server component distinction is important in Next.js 15
- The Prisma client is generated to `generated/prisma` (custom path)
- Database provider is PostgreSQL (can switch to SQLite for local dev by changing schema)
- All user input must be validated with Zod schemas (both client and server side)
- Form validation is already implemented in `src/app/_components/post.tsx`
- Pagination with infinite scroll is already implemented
- Use `'use client'` directive only when necessary (interactivity, hooks, browser APIs)

## Testing

Current testing setup:
- Linting: ESLint with Next.js config
- Type checking: TypeScript compiler
- Code formatting: Prettier with Tailwind plugin

Run quality checks:
```bash
npm run check  # Runs lint + typecheck
```

## Language Note

The README and some documentation is in Finnish, but the codebase is in English. When communicating about this project:
- Code, variables, functions: English
- UI text: Can be Finnish or English based on requirements
- Documentation: Can be either language
