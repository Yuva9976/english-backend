// seed.js
// Run this with: node seed.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, testConnection, User, Lesson, LessonSection } = require('./models');

async function run() {
  try {
    // Step 1: Connect to database
    await testConnection();
    await sequelize.sync({ alter: true });

    // Step 2: Create teacher
    const teacherEmail = 'teacher@example.com';
    const teacherPassword = 'teach123';
    const teacherHash = await bcrypt.hash(teacherPassword, 10);
    const [teacher, createdTeacher] = await User.findOrCreate({
      where: { email: teacherEmail },
      defaults: {
        name: 'Seed Teacher',
        email: teacherEmail,
        password_hash: teacherHash,
        role: 'teacher',
      },
    });
    console.log(`Teacher: ${teacher.email} (created=${createdTeacher})`);

    // Step 3: Create learner
    const learnerEmail = 'learner@example.com';
    const learnerPassword = 'learn123';
    const learnerHash = await bcrypt.hash(learnerPassword, 10);
    const [learner, createdLearner] = await User.findOrCreate({
      where: { email: learnerEmail },
      defaults: {
        name: 'Seed Learner',
        email: learnerEmail,
        password_hash: learnerHash,
        role: 'learner',
      },
    });
    console.log(`Learner: ${learner.email} (created=${createdLearner})`);

    // Step 4: Create lesson
    const title = 'Lesson 1 - Basic Grammar';
    const slug = title.toLowerCase().replace(/\s+/g, '-').slice(0, 200);
    const [lesson, createdLesson] = await Lesson.findOrCreate({
      where: { slug },
      defaults: {
        title,
        slug,
        description: 'This is a seeded lesson for basic grammar.',
        level: 'beginner',
        created_by: teacher.id,
      },
    });
    console.log(`Lesson: ${lesson.title} (created=${createdLesson}, id=${lesson.id})`);

    // Step 5: Create section
    const [section, createdSection] = await LessonSection.findOrCreate({
      where: { lesson_id: lesson.id, order_index: 1 },
      defaults: {
        lesson_id: lesson.id,
        title: 'Introduction',
        content: 'This is a sample section for the lesson.',
        order_index: 1,
      },
    });
    console.log(`Section: ${section.title} (created=${createdSection}, id=${section.id})`);

    console.log('\n✅ Seeding complete! You can now log in with:');
    console.log(`   Teacher → ${teacherEmail} / ${teacherPassword}`);
    console.log(`   Learner → ${learnerEmail} / ${learnerPassword}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

run();
