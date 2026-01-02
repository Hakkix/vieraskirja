# Development Setup Guide

## Quick Start

Run the automated setup script:

```bash
./setup-dev.sh
```

This script will:
1. Create a `.env` file for SQLite development
2. Install dependencies
3. Generate the Prisma client for your platform
4. Create/verify the SQLite database with the correct schema

## Manual Setup

If you prefer to set up manually, follow these steps:

### 1. Create Environment File

Create a `.env` file in the project root:

```bash
DATABASE_URL="file:./db.sqlite"
```

### 2. Install Dependencies

```bash
npm install
```

**Note:** If you encounter Prisma engine download errors with `403 Forbidden`, you may need to set:

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npm install
```

### 3. Set Up Database

#### Option A: Using Prisma (Recommended)

If you have network access to `binaries.prisma.sh`:

```bash
npx prisma generate
npx prisma db push
```

#### Option B: Manual SQLite Setup

If Prisma commands fail due to network restrictions:

```bash
sqlite3 db.sqlite << 'SQL'
CREATE TABLE IF NOT EXISTS "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "avatarSeed" TEXT NOT NULL DEFAULT '',
    "moderationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "Post_name_idx" ON "Post"("name");
CREATE INDEX IF NOT EXISTS "Post_moderationStatus_idx" ON "Post"("moderationStatus");

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checksum" TEXT NOT NULL,
    "finished_at" DATETIME,
    "migration_name" TEXT NOT NULL,
    "logs" TEXT,
    "rolled_back_at" DATETIME,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);
SQL
```

### 4. Verify Database Schema

Check that the database has the correct schema:

```bash
sqlite3 db.sqlite "PRAGMA table_info(Post);"
```

Expected output should include:
- id
- name
- message
- avatarSeed
- moderationStatus
- createdAt
- updatedAt

### 5. Start Development Server

```bash
npm run dev
```

## Troubleshooting

### Error: "Unknown argument `moderationStatus`"

This means your database schema is missing the `moderationStatus` field. Run the manual database setup (Option B above) or use the setup script.

### Error: "Prisma Client could not locate the Query Engine"

This occurs when the Prisma client was generated on a different platform than where you're running it.

**Solution:**

1. Delete the generated Prisma client:
   ```bash
   rm -rf generated/prisma
   ```

2. Regenerate for your platform:
   ```bash
   npx prisma generate
   ```

**If you see network errors:**
- Ensure you have access to `binaries.prisma.sh`
- Try setting `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`
- If behind a firewall/proxy, you may need to configure network access

### Error: "403 Forbidden" when downloading Prisma engines

This is a network restriction. You have two options:

1. **Temporary:** Use the manual SQLite setup and skip Prisma commands
2. **Permanent:** Configure network access to allow `binaries.prisma.sh`

## Database Schema Reference

The Post model includes:

```prisma
model Post {
    id              Int              @id @default(autoincrement())
    name            String
    message         String           @default("")
    avatarSeed      String           @default("")
    moderationStatus ModerationStatus @default(PENDING)
    createdAt       DateTime         @default(now())
    updatedAt       DateTime         @updatedAt
}

enum ModerationStatus {
    PENDING
    APPROVED
    REJECTED
}
```

## Optional Configuration

### Email Notifications

To enable email notifications (optional):

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="onboarding@resend.dev"
EMAIL_TO="your-email@example.com"
```

### Admin Panel

To secure the admin panel:

```env
NEXT_PUBLIC_ADMIN_KEY="your-secure-admin-password"
```

Default password is `admin123` if not set.

## Common Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run typecheck` - Run TypeScript checks
- `npm run check` - Run both lint and typecheck
- `npx prisma studio` - Open database GUI
- `npx prisma db push` - Push schema changes to database
