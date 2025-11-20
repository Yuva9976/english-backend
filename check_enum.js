require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'english_portal',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASS || 'mayu'
});

async function checkEnum() {
  try {
    // Check column type
    const col = await pool.query(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'lessons' AND column_name = 'level'
    `);
    console.log('Column info:', col.rows);
    
    if (col.rows[0]?.udt_name) {
      // Get enum values
      const vals = await pool.query(`
        SELECT enumlabel 
        FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = $1)
      `, [col.rows[0].udt_name]);
      console.log('Allowed enum values:', vals.rows.map(r => r.enumlabel));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkEnum();
