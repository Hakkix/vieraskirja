#!/bin/bash
# Script to add timing logs throughout the codebase
# This helps identify which parts are slow

echo "This script shows you where to add timing logs to debug startup performance"
echo ""
echo "=== 1. Add to next.config.js (top of file) ==="
cat << 'EOF'
const configStart = Date.now();
console.log('⏱️  [0ms] Config loading...');

// ... existing imports ...

console.log(`⏱️  [${Date.now() - configStart}ms] Config loaded`);
EOF

echo ""
echo "=== 2. Add to src/env.js (top of file) ==="
cat << 'EOF'
const envStart = Date.now();
console.log('⏱️  [ENV] Starting environment validation...');

// ... existing code ...

console.log(`⏱️  [ENV] Validation complete in ${Date.now() - envStart}ms`);
EOF

echo ""
echo "=== 3. Add to src/server/db.ts ==="
cat << 'EOF'
const dbStart = Date.now();
console.log('⏱️  [DB] Loading Prisma client...');

// ... existing code ...

console.log(`⏱️  [DB] Prisma client loaded in ${Date.now() - dbStart}ms`);
EOF

echo ""
echo "=== 4. Add to src/app/layout.tsx ==="
cat << 'EOF'
console.log('⏱️  [LAYOUT] Root layout rendering...');

// ... inside component ...
EOF

echo ""
echo "=== 5. Monitor API calls in browser ==="
cat << 'EOF'
1. Open DevTools > Network tab
2. Filter by "trpc"
3. Look at "Waiting (TTFB)" column
4. This shows the artificial 100-500ms delay
EOF
