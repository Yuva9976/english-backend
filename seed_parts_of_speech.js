#!/usr/bin/env node
// seed_parts_of_speech.js
// Seed all 8 parts of speech learning materials and quiz data
// Run with: node seed_parts_of_speech.js

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  sequelize,
  PartOfSpeech,
  GrammarType,
  GrammarRule,
  GrammarExample,
  GrammarExercise,
  GrammarQuizQuestion,
  GrammarResource,
} = require('./models/grammar');

// Load all learning data files
const learningDataPath = path.join(__dirname, 'data');
const partsData = {};

// Helper to load JSON files
function loadJSON(filename) {
  try {
    const filePath = path.join(learningDataPath, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filename}`);
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`❌ Error loading ${filename}:`, err.message);
    return null;
  }
}

async function seedPartsOfSpeech() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized');

    // Parts of speech names and order
    const partsOrder = [
      'nouns',
      'pronouns',
      'verbs',
      'adjectives',
      'adverbs',
      'prepositions',
      'conjunctions',
      'interjections',
    ];

    const partsData = {};

    // Load all learning and quiz data
    console.log('\n📚 Loading data files...');
    for (const partName of partsOrder) {
      const learningFile = `${partName}_learning.json`;
      const quizFile = `${partName}_quiz.json`;

      const learning = loadJSON(learningFile);
      const quiz = loadJSON(quizFile);

      if (learning) {
        partsData[partName] = { learning, quiz };
        console.log(`  ✅ ${partName}: learning & quiz data loaded`);
      } else {
        console.log(`  ⚠️  ${partName}: skipping (file not found)`);
      }
    }

    console.log('\n🌱 Starting seed process...\n');

    // Seed each part of speech
    let successCount = 0;
    for (const partName of partsOrder) {
      if (!partsData[partName]) continue;

      const { learning, quiz } = partsData[partName];
      let partId = learning.part_id;
      
      // Check if this part already exists by name
      const existingPart = await PartOfSpeech.findOne({ where: { name: learning.name } });
      if (existingPart) {
        partId = existingPart.id;
      }

      console.log(`\n━━━ Seeding ${learning.name} (ID: ${partId}) ━━━`);

      // 1. Create or update PartOfSpeech
      let part = await PartOfSpeech.findByPk(partId);
      let partCreated = false;
      
      if (!part) {
        try {
          part = await PartOfSpeech.create({
            id: partId,
            name: learning.name,
            definition: learning.definition,
            importance: learning.importance,
            icon: learning.icon,
          });
          partCreated = true;
        } catch (err) {
          // If creation fails (duplicate), fetch it
          part = await PartOfSpeech.findOne({ where: { name: learning.name } });
        }
      }
      
      if (part) {
        await part.update({
          name: learning.name,
          definition: learning.definition,
          importance: learning.importance,
          icon: learning.icon,
        });
      }
      
      console.log(`  ✓ Part of Speech: "${learning.name}" ${partCreated ? '(created)' : '(updated)'}`);

      // 2. Seed Types
      if (learning.types && Array.isArray(learning.types)) {
        await GrammarType.destroy({ where: { part_id: partId } });
        for (const type of learning.types) {
          await GrammarType.create({
            part_id: partId,
            name: type.name,
            description: type.description,
            icon: type.emoji,
            examples: type.examples || [],
            sample_words: type.examples || [],
            color: type.color,
          });
        }
        console.log(`  ✓ Types: ${learning.types.length} created`);
      }

      // 3. Seed Rules
      if (learning.rules && Array.isArray(learning.rules)) {
        await GrammarRule.destroy({ where: { part_id: partId } });
        for (const rule of learning.rules) {
          await GrammarRule.create({
            part_id: partId,
            rule_type: rule.type || 'do',
            title: rule.title,
            points: rule.points || [],
          });
        }
        console.log(`  ✓ Rules: ${learning.rules.length} created`);
      }

      // 4. Seed Examples
      if (learning.examples && Array.isArray(learning.examples)) {
        await GrammarExample.destroy({ where: { part_id: partId } });
        for (const example of learning.examples) {
          await GrammarExample.create({
            part_id: partId,
            sentence: example.sentence,
            usage_pattern: example.usage_pattern,
            category: example.category,
          });
        }
        console.log(`  ✓ Examples: ${learning.examples.length} created`);
      }

      // 5. Seed Exercises
      if (learning.exercises && Array.isArray(learning.exercises)) {
        await GrammarExercise.destroy({ where: { part_id: partId } });
        for (const exercise of learning.exercises) {
          await GrammarExercise.create({
            part_id: partId,
            exercise_type: exercise.type || 'writing',
            title: exercise.title,
            prompt: exercise.prompt || exercise.instruction,
            passage: exercise.passage || null,
            sample_answer: exercise.sample_answer,
          });
        }
        console.log(`  ✓ Exercises: ${learning.exercises.length} created`);
      }

      // 6. Seed Resources (videos + links)
      if (learning.videos || learning.resources) {
        await GrammarResource.destroy({ where: { part_id: partId } });

        // Videos
        if (learning.videos && Array.isArray(learning.videos)) {
          for (const video of learning.videos) {
            await GrammarResource.create({
              part_id: partId,
              title: video.title,
              url: video.url,
              description: video.description,
              resource_type: 'video',
            });
          }
        }

        // Other resources
        if (learning.resources && Array.isArray(learning.resources)) {
          for (const resource of learning.resources) {
            await GrammarResource.create({
              part_id: partId,
              title: resource.title,
              url: resource.url,
              description: resource.description,
              resource_type: 'article',
            });
          }
        }

        const totalResources = (learning.videos?.length || 0) + (learning.resources?.length || 0);
        console.log(`  ✓ Resources: ${totalResources} created`);
      }

      // 7. Seed Quiz Questions
      if (quiz) {
        let quizCount = 0;
        await GrammarQuizQuestion.destroy({ where: { part_id: partId } });

        // Get quiz content (handle both nested and flat structures)
        const quizContent = quiz.quiz_content || quiz;

        // MCQ questions
        if (quizContent.mcq) {
          for (const difficulty of ['easy', 'medium', 'hard']) {
            if (quizContent.mcq[difficulty]) {
              for (const q of quizContent.mcq[difficulty]) {
                await GrammarQuizQuestion.create({
                  part_id: partId,
                  question: q.question,
                  question_type: 'multiple-choice',
                  options: q.options || [],
                  correct_answer: q.correct_answer,
                  explanation: q.explanation,
                });
                quizCount++;
              }
            }
          }
        }

        // Fill-in-blank questions
        if (quizContent.fill_in_blank) {
          const fillBlankQuestions = Array.isArray(quizContent.fill_in_blank) ? quizContent.fill_in_blank : Object.values(quizContent.fill_in_blank).flat();
          for (const q of fillBlankQuestions) {
            await GrammarQuizQuestion.create({
              part_id: partId,
              question: q.question,
              question_type: 'fill-blank',
              correct_answer: typeof q.correct_answer === 'string' ? q.correct_answer : null,
              explanation: q.explanation,
              options: typeof q.correct_answer === 'string' ? [q.correct_answer] : [],
            });
            quizCount++;
          }
        }

        console.log(`  ✓ Quiz Questions: ${quizCount} created`);
      }

      successCount++;
      console.log(`  ✨ "${learning.name}" seeded successfully!`);
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Seeding completed! ${successCount}/8 parts of speech seeded`);
    console.log('='.repeat(50));

    console.log('\n📊 Summary:');
    console.log('  • All parts of speech created');
    console.log('  • Types, rules, examples loaded');
    console.log('  • Exercises and resources added');
    console.log('  • Quiz questions populated');

    console.log('\n🚀 Ready to use! Your API endpoints:');
    console.log('  GET  /api/grammar/parts-of-speech');
    console.log('  GET  /api/grammar/parts-of-speech/:id');
    console.log('  GET  /api/grammar/parts-of-speech/:id/quiz');

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeding failed:', err);
    await sequelize.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedPartsOfSpeech();
}

module.exports = { seedPartsOfSpeech };
