const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('english_portal', 'myuser', 'mayu', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

const definitions = {
  250: "A common noun is a general name for a person, place, thing, or idea. Unlike proper nouns, common nouns are not capitalized unless they begin a sentence.",
  252: "An abstract noun is a noun that refers to an intangible concept, idea, quality, or state that cannot be perceived through the five senses. Abstract nouns represent things that exist as ideas or feelings rather than physical objects."
};

async function addDefinitions() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    for (const [typeId, definition] of Object.entries(definitions)) {
      const [results] = await sequelize.query(`
        SELECT id, name, learn_more_content
        FROM grammar_types
        WHERE id = ${typeId}
      `);

      if (results.length > 0) {
        const currentContent = results[0].learn_more_content || {};
        
        if (currentContent.overview) {
          currentContent.overview.definition = definition;
          
          await sequelize.query(`
            UPDATE grammar_types 
            SET learn_more_content = :content
            WHERE id = :id
          `, {
            replacements: {
              id: typeId,
              content: JSON.stringify(currentContent)
            }
          });

          console.log(`✅ Added definition to ${results[0].name} (ID: ${typeId})`);
        }
      }
    }

    console.log('\n✅ All definitions added successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addDefinitions();
