// seed_roles_users.js
// Creates three test users: learner, teacher, admin (password: password123)
require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, testConnection, User } = require('./models');

async function run() {
  try {
    await testConnection();
    await sequelize.sync({ alter: true });

    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);

    const users = [
      { name: 'Seed Learner', email: 'learner@example.com', role: 'learner' },
      { name: 'Seed Teacher', email: 'teacher@example.com', role: 'teacher' },
      { name: 'Seed Admin', email: 'admin@example.com', role: 'admin' },
    ];

    for (const u of users) {
      const [user, created] = await User.findOrCreate({
        where: { email: u.email },
        defaults: {
          name: u.name,
          email: u.email,
          password_hash: hash,
          role: u.role,
        },
      });
      console.log(`${u.role.toUpperCase()}: ${user.email} (created=${created})`);
    }

    console.log('\n✅ Seed complete. All accounts use password: password123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
