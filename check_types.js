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

async function checkTypes() {
  try {
    const [results] = await sequelize.query(
      `SELECT id, name FROM grammar_types WHERE part_id = (SELECT id FROM parts_of_speech WHERE name = 'Nouns')`
    );
    
    console.log('\nAvailable Noun Types in Database:\n');
    results.forEach(r => {
      console.log(`  ID: ${r.id} - ${r.name}`);
    });
    
    // Check if learn_more_content column exists (PostgreSQL)
    const [columns] = await sequelize.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'grammar_types' AND column_name = 'learn_more_content'`
    );
    
    if (columns.length > 0) {
      console.log('\n✅ learn_more_content column exists');
    } else {
      console.log('\n❌ learn_more_content column does NOT exist - need to add it');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTypes();
