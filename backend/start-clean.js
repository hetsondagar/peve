#!/usr/bin/env node

// Clean startup script with no rate limiting
console.log('🚀 Starting peve backend (clean version)...');

// Set memory options
process.env.NODE_OPTIONS = '--max-old-space-size=512';

// Import and start the server
require('./dist/src/index-clean.js');
