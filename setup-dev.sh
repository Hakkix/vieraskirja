#!/bin/bash

# Development Setup Script for Vieraskirja
# This script sets up the development environment

set -e

echo "🚀 Setting up Vieraskirja development environment..."

# Step 1: Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file for SQLite development..."
    cat > .env << 'ENV'
DATABASE_URL="file:./db.sqlite"
ENV
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npm install || {
    echo "⚠️  npm install failed, but this might be due to network restrictions"
    echo "   The app might still work if dependencies are already installed"
}

# Step 3: Generate Prisma client for current platform
echo "🔧 Generating Prisma client for current platform..."
rm -rf generated/prisma
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate || {
    echo "⚠️  Prisma generate failed due to network restrictions"
    echo "   You may need to run this when you have network access to binaries.prisma.sh"
    echo "   Alternatively, the database is ready and you can use raw SQL queries"
}

# Step 4: Set up database
if [ ! -f db.sqlite ]; then
    echo "🗄️  Creating SQLite database with schema..."
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
    echo "✅ Database created successfully"
else
    echo "✅ Database already exists"

    # Verify schema
    echo "🔍 Verifying database schema..."
    if sqlite3 db.sqlite "SELECT moderationStatus FROM Post LIMIT 1" 2>/dev/null; then
        echo "✅ Database schema is correct"
    else
        echo "⚠️  moderationStatus column missing, updating schema..."
        sqlite3 db.sqlite << 'SQL'
ALTER TABLE Post ADD COLUMN moderationStatus TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE Post ADD COLUMN avatarSeed TEXT NOT NULL DEFAULT '';
SQL
        echo "✅ Database schema updated"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Note: If you see Prisma engine errors, you need network access to"
echo "      binaries.prisma.sh to download the query engine for your platform."
