const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { seeding } = require('./seed');
async function run() {
  try {
    // Define database path
    const dbPath = path.join(__dirname, 'dev.db');

    // Check if database exist and drop it.
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('DROP DATABASE: dev.db');
    }

    // Push the schema to new database
    execSync('npx prisma db push');

    await seeding();
  } catch (err) {
    console.log(err);
  }
}

console.log('Reset DB...');
run();
