#!/usr/bin/env node
// verify_data.js
// Verify the seeded data in the database

require('dotenv').config();
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

async function verifyData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    // Get all parts of speech
    const parts = await PartOfSpeech.findAll({ order: [['id', 'ASC']] });
    
    if (parts.length === 0) {
      console.log('❌ No parts of speech found!');
      process.exit(1);
    }

    console.log('📚 Parts of Speech Summary');
    console.log('='.repeat(70));

    let totalTypes = 0;
    let totalRules = 0;
    let totalExamples = 0;
    let totalExercises = 0;
    let totalResources = 0;
    let totalQuestions = 0;

    for (const part of parts) {
      const types = await GrammarType.count({ where: { part_id: part.id } });
      const rules = await GrammarRule.count({ where: { part_id: part.id } });
      const examples = await GrammarExample.count({ where: { part_id: part.id } });
      const exercises = await GrammarExercise.count({ where: { part_id: part.id } });
      const resources = await GrammarResource.count({ where: { part_id: part.id } });
      const questions = await GrammarQuizQuestion.count({ where: { part_id: part.id } });

      totalTypes += types;
      totalRules += rules;
      totalExamples += examples;
      totalExercises += exercises;
      totalResources += resources;
      totalQuestions += questions;

      console.log(`\n${part.name.padEnd(20)} (ID: ${part.id})`);
      console.log(`  Types:     ${types.toString().padStart(3)}  │  Rules:    ${rules.toString().padStart(3)}`);
      console.log(`  Examples:  ${examples.toString().padStart(3)}  │  Exercises: ${exercises.toString().padStart(3)}`);
      console.log(`  Resources: ${resources.toString().padStart(3)}  │  Questions: ${questions.toString().padStart(3)}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n📊 Grand Total');
    console.log('='.repeat(70));
    console.log(`  Parts of Speech:  ${parts.length}`);
    console.log(`  Grammar Types:    ${totalTypes}`);
    console.log(`  Grammar Rules:    ${totalRules}`);
    console.log(`  Examples:         ${totalExamples}`);
    console.log(`  Exercises:        ${totalExercises}`);
    console.log(`  Resources:        ${totalResources}`);
    console.log(`  Quiz Questions:   ${totalQuestions}`);
    console.log('='.repeat(70));

    // Show sample quiz questions
    console.log('\n📝 Sample Quiz Questions');
    console.log('='.repeat(70));
    
    const sampleMCQ = await GrammarQuizQuestion.findOne({
      where: { question_type: 'multiple-choice' },
      order: [['id', 'ASC']]
    });

    const sampleFillBlank = await GrammarQuizQuestion.findOne({
      where: { question_type: 'fill-blank' },
      order: [['id', 'ASC']]
    });

    if (sampleMCQ) {
      console.log('\n🎯 Multiple Choice Sample:');
      console.log(`   Q: ${sampleMCQ.question}`);
      console.log(`   Options: ${JSON.stringify(sampleMCQ.options)}`);
      console.log(`   Answer Index: ${sampleMCQ.correct_answer}`);
      console.log(`   Explanation: ${sampleMCQ.explanation}`);
    }

    if (sampleFillBlank) {
      console.log('\n✏️  Fill-in-the-Blank Sample:');
      console.log(`   Q: ${sampleFillBlank.question}`);
      console.log(`   Correct Answer: ${sampleFillBlank.correct_answer}`);
      console.log(`   Explanation: ${sampleFillBlank.explanation}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Data verification complete!');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

verifyData();
