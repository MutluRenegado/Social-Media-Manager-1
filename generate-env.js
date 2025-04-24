import fs from 'fs';
import path from 'path';

const inputPath = path.join(__dirname, 'netlistore-firebase-adminsdk-fbsvc-4fcc8adca2.json');
const outputPath = path.join(__dirname, '.env.local');

// Read the service account file and parse JSON
const raw = fs.readFileSync(inputPath, 'utf8');
const json = JSON.parse(raw);

// Escape newlines in private_key for environment variable
if (json.private_key) {
  json.private_key = json.private_key.replace(/\n/g, '\\n');
}

// Stringify the JSON with escaped private_key
const singleLine = JSON.stringify(json);

// Prepare the content
const envContent = `FIREBASE_SERVICE_ACCOUNT_KEY=${singleLine}\n`;

// Force overwrite the file (even if it's read-only or hidden)
try {
  fs.writeFileSync(outputPath, envContent, { encoding: 'utf8' });
  console.log('✅ .env.local successfully overwritten with FIREBASE_SERVICE_ACCOUNT_KEY.');
} catch (err) {
  console.error('❌ Failed to write to .env.local:', err.message);
}
