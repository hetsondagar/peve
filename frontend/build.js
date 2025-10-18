#!/usr/bin/env node

// Frontend build script for Vercel
const { execSync } = require('child_process');

console.log('🚀 Starting frontend build...');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the application
  console.log('🔨 Building application...');
  execSync('npx vite build', { stdio: 'inherit' });

  console.log('✅ Frontend build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
