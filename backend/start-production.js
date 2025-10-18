#!/usr/bin/env node

// Production startup script with memory optimization
const { spawn } = require('child_process');
const path = require('path');

// Set memory options
const memoryOptions = [
  '--max-old-space-size=512',
  '--optimize-for-size',
  '--gc-interval=100'
];

// Set environment
process.env.NODE_ENV = 'production';

// Start the application
const child = spawn('node', [...memoryOptions, path.join(__dirname, 'dist', 'index.js')], {
  stdio: 'inherit',
  env: { ...process.env }
});

child.on('error', (err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  child.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  child.kill('SIGINT');
});
