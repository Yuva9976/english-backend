const { sequelize } = require('./models/grammar');

(async () => {
  try {
    const [results] = await sequelize.query(`
      SELECT id, name, 
        CASE 
          WHEN learn_more_content IS NULL THEN 'NULL' 
          ELSE 'HAS DATA' 
        END as content_status 
      FROM grammar_types 
      WHERE part_id = (SELECT id FROM parts_of_speech WHERE name = 'Nouns') 
      ORDER BY id
    `);
    console.table(results);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
})();
