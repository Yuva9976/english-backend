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

async function seedNounTypes() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check if Parts of Speech exists
    const [parts] = await sequelize.query(
      `SELECT id FROM parts_of_speech WHERE name = 'Nouns'`
    );

    let partId;
    if (parts.length === 0) {
      // Create Parts of Speech entry
      const [result] = await sequelize.query(
        `INSERT INTO parts_of_speech (name, definition, importance, icon, created_at, updated_at)
         VALUES ('Nouns', 'Words that name people, places, things, or ideas', 'Foundation of sentence structure', '📝', NOW(), NOW())
         RETURNING id`
      );
      partId = result[0].id;
      console.log('✓ Created Parts of Speech: Nouns\n');
    } else {
      partId = parts[0].id;
      console.log('✓ Parts of Speech "Nouns" exists\n');
    }

    // Define noun types
    const nounTypes = [
      { name: 'Proper Nouns', description: 'Specific names of people, places, or organizations', icon: '👤', color: '#3b82f6' },
      { name: 'Common Nouns', description: 'General names for people, places, or things', icon: '📦', color: '#10b981' },
      { name: 'Concrete Nouns', description: 'Things that can be perceived by the senses', icon: '🧱', color: '#f59e0b' },
      { name: 'Abstract Nouns', description: 'Ideas, qualities, or concepts', icon: '💭', color: '#8b5cf6' },
      { name: 'Countable Nouns', description: 'Nouns that can be counted', icon: '🔢', color: '#fbbf24' },
      { name: 'Uncountable Nouns', description: 'Nouns that cannot be counted', icon: '💧', color: '#06b6d4' },
      { name: 'Collective Nouns', description: 'Groups of people or things', icon: '👥', color: '#ef4444' },
      { name: 'Compound Nouns', description: 'Nouns made from two or more words', icon: '🔗', color: '#ec4899' }
    ];

    console.log('Creating noun types...\n');
    
    for (const type of nounTypes) {
      // Check if exists
      const [existing] = await sequelize.query(
        `SELECT id FROM grammar_types WHERE name = $1 AND part_id = $2`,
        { bind: [type.name, partId] }
      );

      if (existing.length === 0) {
        await sequelize.query(
          `INSERT INTO grammar_types (part_id, name, description, icon, color, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
          { bind: [partId, type.name, type.description, type.icon, type.color] }
        );
        console.log(`✓ Created: ${type.name}`);
      } else {
        console.log(`- Already exists: ${type.name}`);
      }
    }

    console.log('\n✅ All noun types created!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedNounTypes();
