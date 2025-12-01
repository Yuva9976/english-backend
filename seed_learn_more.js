const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Database connection
require('dotenv').config();
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

async function seedLearnMoreContent() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get the noun type you want to update
    const nounTypeName = process.argv[2]; // e.g., 'Proper Nouns'
    const jsonFileName = process.argv[3]; // e.g., 'proper_nouns_learn_more.json'

    if (!nounTypeName || !jsonFileName) {
      console.error('❌ Usage: node seed_learn_more.js "Proper Nouns" "proper_nouns_learn_more.json"');
      process.exit(1);
    }

    // Read the JSON file
    const filePath = path.join(__dirname, 'data', jsonFileName);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    const learnMoreData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📖 Loaded: ${jsonFileName}`);
    console.log(`📊 Examples: ${learnMoreData.examples?.length || 0}`);
    console.log(`📊 Practice: ${learnMoreData.practice?.length || 0}\n`);

    // Find the grammar type
    const [results] = await sequelize.query(
      `SELECT id, name FROM grammar_types WHERE name = $1`,
      { bind: [nounTypeName] }
    );

    if (results.length === 0) {
      console.error(`❌ Grammar type "${nounTypeName}" not found in database`);
      console.log('\n📋 Available types:');
      const [allTypes] = await sequelize.query(`SELECT name FROM grammar_types WHERE part_id = (SELECT id FROM parts_of_speech WHERE name = 'Nouns')`);
      allTypes.forEach(t => console.log(`   - ${t.name}`));
      process.exit(1);
    }

    const typeId = results[0].id;
    console.log(`✓ Found type: ${results[0].name} (ID: ${typeId})\n`);

    // Update the learn_more_content column
    await sequelize.query(
      `UPDATE grammar_types SET learn_more_content = $1 WHERE id = $2`,
      { bind: [JSON.stringify(learnMoreData), typeId] }
    );

    console.log('✅ Successfully updated learn_more_content!');
    console.log(`🎯 Type: ${nounTypeName}`);
    console.log(`📁 File: ${jsonFileName}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedLearnMoreContent();
