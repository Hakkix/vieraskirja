// Debug module loader - shows what modules are being loaded and when
const Module = require('module');
const originalRequire = Module.prototype.require;

const startTime = Date.now();
let moduleCount = 0;
const slowModules = [];

Module.prototype.require = function(id) {
  const moduleStart = Date.now();
  const result = originalRequire.apply(this, arguments);
  const duration = Date.now() - moduleStart;

  moduleCount++;

  // Track slow modules (>50ms)
  if (duration > 50) {
    slowModules.push({ id, duration, timestamp: Date.now() - startTime });
    console.log(`[SLOW MODULE] ${duration}ms - ${id}`);
  }

  return result;
};

process.on('exit', () => {
  console.log('\n=== Module Loading Summary ===');
  console.log(`Total modules loaded: ${moduleCount}`);
  console.log(`Slow modules (>50ms): ${slowModules.length}`);

  if (slowModules.length > 0) {
    console.log('\nSlowest modules:');
    slowModules
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
      .forEach(({ id, duration, timestamp }) => {
        console.log(`  ${duration}ms @ ${timestamp}ms - ${id}`);
      });
  }
});
