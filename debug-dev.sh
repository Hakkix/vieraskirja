#!/bin/bash
# Script to debug npm run dev performance

echo "=== Next.js Dev Server Debug ==="
echo ""

# Option 1: Basic timing
echo "1. Basic timing measurement:"
echo "   time npm run dev"
echo ""

# Option 2: Next.js debug mode
echo "2. Next.js debug mode (shows detailed compilation logs):"
echo "   NEXT_DEBUG=1 npm run dev"
echo ""

# Option 3: Turbopack debug
echo "3. Turbopack debug (shows what Turbopack is compiling):"
echo "   NEXT_DEBUG_TURBOPACK=1 npm run dev"
echo ""

# Option 4: Node.js CPU profiling
echo "4. Node.js CPU profiling (creates isolate-*.log):"
echo "   node --cpu-prof node_modules/.bin/next dev --turbo"
echo "   Then analyze with: node --prof-process isolate-*.log > profile.txt"
echo ""

# Option 5: Node.js inspect (for Chrome DevTools)
echo "5. Node.js inspect mode (debug in Chrome DevTools):"
echo "   node --inspect node_modules/.bin/next dev --turbo"
echo "   Then open: chrome://inspect"
echo ""

# Option 6: Trace startup
echo "6. Trace Node.js startup:"
echo "   node --trace-warnings node_modules/.bin/next dev --turbo"
echo ""

# Option 7: Measure with timing wrapper
echo "7. Measure specific startup phases:"
cat << 'TIMING'
   Add this to next.config.js top:

   const startTime = Date.now();
   console.log('[STARTUP] Config loading started');

   // ... rest of config ...

   console.log(`[STARTUP] Config loaded in ${Date.now() - startTime}ms`);
TIMING
echo ""

# Option 8: Check what's being loaded
echo "8. See all module loading:"
echo "   NODE_OPTIONS='--require ./debug-loader.js' npm run dev"
echo ""

# Option 9: Memory profiling
echo "9. Memory heap profiling:"
echo "   node --inspect --heap-prof node_modules/.bin/next dev --turbo"
echo ""

echo "=== Network/API Debugging ==="
echo ""
echo "10. After server starts, check tRPC delays:"
echo "    - Open browser DevTools > Network tab"
echo "    - Look for /api/trpc calls"
echo "    - Check 'Waiting (TTFB)' time"
echo "    - Should see the 100-500ms artificial delay"
echo ""

echo "=== Quick Start ==="
echo "Run this now to see basic debug output:"
echo "   NEXT_DEBUG=1 npm run dev 2>&1 | tee dev-debug.log"
