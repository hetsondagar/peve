const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Peve Backend with MongoDB Atlas');
console.log('==========================================');
console.log('');

// Check if MONGO_URI is provided as command line argument
const mongoUri = process.argv[2];

if (!mongoUri) {
  console.log('❌ Error: MongoDB Atlas connection string required!');
  console.log('');
  console.log('Usage: node start-atlas.js "mongodb+srv://username:password@cluster-url/peve"');
  console.log('');
  console.log('Example:');
  console.log('node start-atlas.js "mongodb+srv://myuser:mypass@cluster0.abc123.mongodb.net/peve?retryWrites=true&w=majority"');
  console.log('');
  console.log('To get your Atlas connection string:');
  console.log('1. Go to https://cloud.mongodb.com/');
  console.log('2. Click "Connect" on your cluster');
  console.log('3. Choose "Connect your application"');
  console.log('4. Copy the connection string');
  console.log('5. Replace <username>, <password>, and <cluster-url> with your actual credentials');
  process.exit(1);
}

console.log('✅ MongoDB Atlas URI provided');
console.log('🔧 Setting environment variables...');

// Set environment variables
process.env.MONGO_URI = mongoUri;
process.env.PORT = '5000';
process.env.JWT_SECRET = 'dev-secret';
process.env.JWT_REFRESH_SECRET = 'dev-refresh-secret';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'development';

console.log('✅ Environment variables set');
console.log('🚀 Starting backend server...');
console.log('');

// Start the backend server
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    MONGO_URI: mongoUri
  }
});

backendProcess.on('error', (error) => {
  console.error('❌ Failed to start backend:', error);
});

backendProcess.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});
