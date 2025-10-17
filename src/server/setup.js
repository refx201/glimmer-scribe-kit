#!/usr/bin/env node

/**
 * procell Server Setup Script
 * Automated setup for the Express server
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
🚀 procell Server Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    console.log('❌ .env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check Node.js version
const nodeVersion = process.version.split('.')[0].substring(1);
if (parseInt(nodeVersion) < 18) {
  console.log(`❌ Node.js version 18+ is required. Current version: ${process.version}`);
  process.exit(1);
}
console.log(`✅ Node.js version: ${process.version}`);

// Read .env file and check for required variables
const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missingVars = [];

for (const varName of requiredVars) {
  if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your_`)) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log(`⚠️  Please configure these environment variables in .env:`);
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log(`\n📝 Edit the .env file and add your Supabase configuration.`);
  console.log(`🔗 Get your Supabase keys from: https://app.supabase.com/project/[your-project]/settings/api`);
} else {
  console.log('✅ Environment variables configured');
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Next Steps:

1. Configure your .env file (if not done already)
2. Install dependencies: npm install
3. Start development server: npm run dev
4. Visit: http://localhost:3001/health

📚 For more help, see: server/README.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

console.log('🏁 Setup complete!');