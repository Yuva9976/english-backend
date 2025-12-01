/**
 * TEMPLATE SEEDER SCRIPT
 * 
 * How to use this template:
 * 1. Copy this file and rename it (e.g., seed_articles.js)
 * 2. Update TOPIC_NAME constant
 * 3. Make sure your JSON files exist in the data/ folder
 * 4. Run: node seed_your_topic.js
 */

const {
  PartOfSpeech,
  GrammarType,
  GrammarRule,
  GrammarExample,
  GrammarExercise,
  GrammarQuizQuestion,
  GrammarResource
} = require('./models/grammar');
const sequelize = require('./config/database');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION - UPDATE THIS!
// ============================================
const TOPIC_NAME = 'Articles';  // Change this to your topic name
const LEARNING_FILE = 'articles_learning.json';  // Your learning JSON file
const QUIZ_FILE = 'articles_quiz.json';  // Your quiz JSON file

// ============================================
// MAIN SEEDER FUNCTION
// ============================================
async function seedTopicData() {
  try {
    console.log(`\n🚀 Starting ${TOPIC_NAME} content seeding...\n`);
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync database
    await sequelize.sync({ alter: false });
    console.log('✅ Tables synced');

    // Load JSON files
    const learningData = loadJSON(LEARNING_FILE);
    const quizData = loadJSON(QUIZ_FILE);
    
    if (!learningData || !quizData) {
      console.error('❌ Failed to load JSON files');
      process.exit(1);
    }

    console.log(`✅ Loaded ${LEARNING_FILE}`);
    console.log(`✅ Loaded ${QUIZ_FILE}`);

    // Validate part_id match
    if (learningData.part_id !== quizData.part_id) {
      console.error('❌ ERROR: part_id mismatch between learning and quiz files!');
      process.exit(1);
    }

    // 1. Create/Find Part of Speech
    console.log('\n📚 Seeding Part of Speech...');
    const [partOfSpeech, created] = await PartOfSpeech.findOrCreate({
      where: { name: learningData.name },
      defaults: {
        name: learningData.name,
        definition: learningData.definition,
        importance: learningData.importance,
        icon: learningData.icon,
        tagline: learningData.tagline,
        color: learningData.color
      }
    });
    console.log(`✅ ${created ? 'Created' : 'Found'} Part of Speech: ${partOfSpeech.name} (ID: ${partOfSpeech.id})`);

    // 2. Seed Types
    if (learningData.types && learningData.types.length > 0) {
      console.log('\n📝 Seeding Types...');
      for (const type of learningData.types) {
        await GrammarType.findOrCreate({
          where: { 
            part_id: partOfSpeech.id, 
            name: type.name 
          },
          defaults: {
            part_id: partOfSpeech.id,
            name: type.name,
            description: type.description,
            emoji: type.emoji,
            examples: JSON.stringify(type.examples),
            sample_words: JSON.stringify(type.examples),
            color: type.color,
            rule: type.rule
          }
        });
      }
      console.log(`✅ Seeded ${learningData.types.length} types`);
    }

    // 3. Seed Rules
    if (learningData.rules && learningData.rules.length > 0) {
      console.log('\n📋 Seeding Rules...');
      for (const rule of learningData.rules) {
        await GrammarRule.findOrCreate({
          where: { 
            part_id: partOfSpeech.id,
            title: rule.title
          },
          defaults: {
            part_id: partOfSpeech.id,
            rule_type: rule.type,
            title: rule.title,
            points: JSON.stringify(rule.points),
            examples: JSON.stringify(rule.examples),
            color: rule.type === 'do' ? 'green' : 'red',
            icon: rule.type === 'do' ? '✅' : '❌'
          }
        });
      }
      console.log(`✅ Seeded ${learningData.rules.length} rules`);
    }

    // 4. Seed Examples
    if (learningData.examples && learningData.examples.length > 0) {
      console.log('\n💡 Seeding Examples...');
      for (const example of learningData.examples) {
        await GrammarExample.findOrCreate({
          where: { 
            part_id: partOfSpeech.id,
            sentence: example.sentence
          },
          defaults: {
            part_id: partOfSpeech.id,
            sentence: example.sentence,
            usage_pattern: example.usage_pattern,
            category: example.category
          }
        });
      }
      console.log(`✅ Seeded ${learningData.examples.length} examples`);
    }

    // 5. Seed Exercises
    if (learningData.exercises && learningData.exercises.length > 0) {
      console.log('\n✍️ Seeding Exercises...');
      for (const exercise of learningData.exercises) {
        await GrammarExercise.findOrCreate({
          where: { 
            part_id: partOfSpeech.id,
            title: exercise.title
          },
          defaults: {
            part_id: partOfSpeech.id,
            exercise_type: exercise.type,
            title: exercise.title,
            prompt: exercise.prompt,
            passage: exercise.passage || null,
            sample_answer: exercise.sample_answer
          }
        });
      }
      console.log(`✅ Seeded ${learningData.exercises.length} exercises`);
    }

    // 6. Seed Quiz Questions (MCQ)
    if (quizData.quiz_content?.mcq) {
      console.log('\n❓ Seeding Quiz Questions...');
      let totalQuestions = 0;
      
      for (const difficulty of ['easy', 'medium', 'hard']) {
        const questions = quizData.quiz_content.mcq[difficulty];
        if (questions && questions.length > 0) {
          for (const q of questions) {
            await GrammarQuizQuestion.findOrCreate({
              where: { 
                part_id: partOfSpeech.id,
                question: q.question
              },
              defaults: {
                part_id: partOfSpeech.id,
                emoji: learningData.icon,
                question: q.question,
                question_type: 'multiple-choice',
                hint: q.explanation,
                options: JSON.stringify(q.options),
                correct_answer: q.correct_answer,
                explanation: q.explanation,
                difficulty: difficulty
              }
            });
            totalQuestions++;
          }
        }
      }
      console.log(`✅ Seeded ${totalQuestions} quiz questions`);
    }

    // 7. Seed Resources
    if (learningData.resources && learningData.resources.length > 0) {
      console.log('\n🔗 Seeding Resources...');
      for (const resource of learningData.resources) {
        await GrammarResource.findOrCreate({
          where: { 
            part_id: partOfSpeech.id,
            title: resource.title
          },
          defaults: {
            part_id: partOfSpeech.id,
            title: resource.title,
            url: resource.url,
            description: resource.description,
            resource_type: resource.type || 'article'
          }
        });
      }
      console.log(`✅ Seeded ${learningData.resources.length} resources`);
    }

    // 8. Seed Videos
    if (learningData.videos && learningData.videos.length > 0) {
      console.log('\n🎥 Seeding Videos...');
      for (const video of learningData.videos) {
        await GrammarResource.findOrCreate({
          where: { 
            part_id: partOfSpeech.id,
            title: video.title
          },
          defaults: {
            part_id: partOfSpeech.id,
            title: video.title,
            url: video.url,
            description: video.description,
            resource_type: 'video',
            video_embed_id: extractYouTubeID(video.url)
          }
        });
      }
      console.log(`✅ Seeded ${learningData.videos.length} videos`);
    }

    console.log(`\n✅ ✨ ${TOPIC_NAME} content seeding completed successfully! ✨\n`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding data:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Load JSON file from data directory
 */
function loadJSON(filename) {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error.message);
    return null;
  }
}

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeID(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  return match ? match[1] : null;
}

/**
 * Validate JSON structure
 */
function validateJSON(data, type) {
  const requiredFields = type === 'learning' 
    ? ['part_id', 'name', 'definition', 'types', 'rules', 'examples']
    : ['part_id', 'part_name', 'quiz_content'];
    
  for (const field of requiredFields) {
    if (!data[field]) {
      console.error(`❌ Missing required field: ${field}`);
      return false;
    }
  }
  return true;
}

// ============================================
// RUN SEEDER
// ============================================
if (require.main === module) {
  seedTopicData();
}

module.exports = seedTopicData;
