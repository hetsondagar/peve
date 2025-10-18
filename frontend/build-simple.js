#!/usr/bin/env node

// Simple build script for Vercel that bypasses config issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting simple build process...');

try {
  // Step 1: Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });

  // Step 2: Create a minimal vite config if needed
  const configPath = path.join(__dirname, 'vite.config.js');
  if (!fs.existsSync(configPath)) {
    console.log('📝 Creating minimal vite config...');
    const minimalConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
`;
    fs.writeFileSync(configPath, minimalConfig);
  }

  // Step 3: Build the application
  console.log('🔨 Building application...');
  execSync('npx vite build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
