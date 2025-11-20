/**
 * seed_module2.js
 * Seed Module 2 (Learn English) lessons into the database
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const CONTENT_DIR = path.join(__dirname, 'content', 'module-2');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'english_portal',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASS || 'mayu'
});

function loadLessons() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  return files.map((f) => {
    const slug = f.replace(/\.md$/, '');
    const text = fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8');
    const title = text.split('\n')[0].replace(/^#\s*/, '') || slug;
    
    // Extract skill_area from slug
    const skillAreaMap = {
      'grammar': 'Grammar',
      'vocabulary': 'Vocabulary',
      'pronunciation': 'Pronunciation',
      'listening': 'Listening',
      'reading': 'Reading',
      'writing': 'Writing',
      'speaking': 'Speaking'
    };
    
    return { 
      slug, 
      title, 
      skill_area: skillAreaMap[slug] || slug,
      level: 'beginner', // Options: beginner, intermediate, advanced
      description: text.substring(0, 200).replace(/^#.*\n/, '').trim(),
      content: text,
      published: true
    };
  });
}

async function seedDatabase() {
  const lessons = loadLessons();
  console.log(`Found ${lessons.length} lessons:`, lessons.map((l) => l.slug));
  
  try {
    for (const lesson of lessons) {
      // Check if lesson already exists
      const existing = await pool.query(
        'SELECT id FROM lessons WHERE slug = $1',
        [lesson.slug]
      );
      
      let lessonId;
      
      if (existing.rows.length > 0) {
        // Update existing lesson
        lessonId = existing.rows[0].id;
        await pool.query(
          `UPDATE lessons 
           SET title = $1, skill_area = $2, level = $3, description = $4, published = $5, updated_at = NOW()
           WHERE id = $6`,
          [lesson.title.trim(), lesson.skill_area, lesson.level, lesson.description, lesson.published, lessonId]
        );
        
        // Delete old sections and insert new content
        await pool.query('DELETE FROM lesson_sections WHERE lesson_id = $1', [lessonId]);
        await pool.query(
          `INSERT INTO lesson_sections (lesson_id, title, order_index, content, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [lessonId, 'Main Content', 1, lesson.content]
        );
        
        console.log(`🔄 Updated: ${lesson.title.trim()} (${lesson.skill_area})`);
      } else {
        // Insert new lesson
        const result = await pool.query(
          `INSERT INTO lessons (slug, title, skill_area, level, description, published, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
           RETURNING id`,
          [lesson.slug, lesson.title.trim(), lesson.skill_area, lesson.level, lesson.description, lesson.published]
        );
        
        lessonId = result.rows[0].id;
        
        // Insert lesson content as a section
        await pool.query(
          `INSERT INTO lesson_sections (lesson_id, title, order_index, content, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [lessonId, 'Main Content', 1, lesson.content]
        );
        
        console.log(`✅ Seeded: ${lesson.title.trim()} (${lesson.skill_area})`);
      }
      
      console.log(`✅ Seeded: ${lesson.title.trim()} (${lesson.skill_area})`);
    }
    
    console.log('\n✅ All lessons seeded successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { loadLessons };
