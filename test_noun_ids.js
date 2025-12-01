const { sequelize } = require('./models/grammar');

(async () => {
  try {
    const [results] = await sequelize.query(
      "SELECT id, name FROM grammar_types WHERE part_id = (SELECT id FROM parts_of_speech WHERE name = 'Nouns') ORDER BY name"
    );
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
})();
