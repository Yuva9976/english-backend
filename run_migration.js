/**
 * run_migration.js
 * Run Module 2 migration without needing psql in PATH
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Read DB config from environment or use defaults
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'english_portal',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASS || 'mayu'
});

async function runMigration() {
  const migrationFile = path.join(__dirname, 'migrations', '001_create_module2_tables.sql');
  
  if (!fs.existsSync(migrationFile)) {
    console.error('Migration file not found:', migrationFile);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationFile, 'utf8');
  
  try {
    console.log('Running migration...');
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
    console.log('Tables created: lessons, lesson_sections, quizzes, media');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigration();
}
