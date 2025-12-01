require('dotenv').config();
const { Sequelize } = require('sequelize');

const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'english_portal',
  DB_USER = 'postgres',
  DB_PASS = ''
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false
});

async function addColumn() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Add learn_more_content column
    await sequelize.query(`
      ALTER TABLE grammar_types 
      ADD COLUMN IF NOT EXISTS learn_more_content JSONB
    `);

    console.log('✅ Added learn_more_content column to grammar_types table\n');

    // Verify
    const [columns] = await sequelize.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'grammar_types' AND column_name = 'learn_more_content'`
    );

    if (columns.length > 0) {
      console.log('✓ Column verified: learn_more_content exists\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addColumn();
