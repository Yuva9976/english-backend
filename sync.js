// sync.js
require('dotenv').config();
const { sequelize } = require('./models');

(async () => {
  try {
    console.log('🔁  Syncing models to DB (development) -- this may alter tables...');
    await sequelize.sync({ alter: true });
    console.log('✅  Sequelize models synced successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌  Failed to sync models:', err);
    process.exit(1);
  }
})();
