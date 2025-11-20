const {
  PartOfSpeech,
  GrammarType,
  GrammarRule,
  GrammarExample,
  GrammarExercise,
  GrammarQuizQuestion,
  GrammarResource
} = require('../models/grammar');
const sequelize = require('../config/database');

const grammarData = {
  parts: [
    {
      name: 'Noun',
      definition: 'A word that names a person, place, thing, or idea.',
      importance: 'Essential for building sentences and expressing concepts.',
      icon: '📦'
    },
    {
      name: 'Pronoun',
      definition: 'A word that replaces a noun to avoid repetition.',
      importance: 'Makes sentences flow smoothly and reduces redundancy.',
      icon: '👤'
    },
    {
      name: 'Verb',
      definition: 'A word that describes an action, state, or occurrence.',
      importance: 'The core of every sentence, expressing what happens.',
      icon: '⚡'
    },
    {
      name: 'Adjective',
      definition: 'A word that describes or modifies a noun.',
      importance: 'Adds detail and clarity to descriptions.',
      icon: '🎨'
    },
    {
      name: 'Adverb',
      definition: 'A word that modifies a verb, adjective, or another adverb.',
      importance: 'Provides context and details about actions.',
      icon: '🎯'
    },
    {
      name: 'Preposition',
      definition: 'A word that shows relationships of time, place, or direction.',
      importance: 'Connects words and clarifies spatial and temporal relationships.',
      icon: '🧭'
    },
    {
      name: 'Conjunction',
      definition: 'A word used to connect words, phrases, or clauses.',
      importance: 'Builds complex sentences and logical connections.',
      icon: '🔗'
    },
    {
      name: 'Interjection',
      definition: 'A word that expresses strong emotion or sudden feeling.',
      importance: 'Adds emotional expression and authenticity to writing.',
      icon: '😮'
    }
  ],
  types: {
    'Noun': [
      { name: 'Common', description: 'General nouns for any member of a group.', icon: '📝', examples: ['cat', 'dog', 'chair'], sample_words: ['cat', 'dog', 'house', 'table'], color: 'blue' },
      { name: 'Proper', description: 'Specific names of people, places, or things.', icon: '🏛️', examples: ['John', 'Paris', 'Google'], sample_words: ['John', 'London', 'Monday'], color: 'purple' },
      { name: 'Collective', description: 'Words for groups of people or things.', icon: '👥', examples: ['team', 'family', 'flock'], sample_words: ['team', 'family', 'jury'], color: 'green' }
    ],
    'Pronoun': [
      { name: 'Personal', description: 'Pronouns that refer to specific people.', icon: '👤', examples: ['I', 'you', 'he', 'she'], sample_words: ['I', 'me', 'you', 'he'], color: 'blue' },
      { name: 'Possessive', description: 'Pronouns showing ownership.', icon: '🔑', examples: ['mine', 'yours', 'his'], sample_words: ['mine', 'yours', 'his'], color: 'orange' },
      { name: 'Relative', description: 'Pronouns that introduce clauses.', icon: '🔗', examples: ['who', 'which', 'that'], sample_words: ['who', 'which', 'that'], color: 'purple' }
    ]
  },
  rules: {
    'Noun': [
      { rule_type: 'do', title: 'DOs', points: ['Use proper nouns with capital letters', 'Use singular and plural correctly', 'Use articles (a, an, the) appropriately'], color: 'green', icon: '✅' },
      { rule_type: 'dont', title: 'DON\'Ts', points: ['Don\'t mix singular and plural in sentences', 'Don\'t use improper capitalization', 'Don\'t confuse count and non-count nouns'], color: 'red', icon: '❌' }
    ]
  },
  exercises: {
    'Noun': [
      { exercise_type: 'writing', title: 'Noun Writing Practice', prompt: 'Write three sentences about your favorite place, using at least 3 different nouns in each.', sample_answer: 'The beach is my favorite place. The sand is warm and the ocean waves are beautiful.' },
      { exercise_type: 'reading', title: 'Identify Nouns', passage: 'Sarah went to the market and bought fresh apples, bread, and milk.', sample_answer: 'Nouns: Sarah, market, apples, bread, milk' }
    ]
  },
  quiz: {
    'Noun': [
      { emoji: '📦', question: 'Which word is a noun: "run", "happy", "book"', question_type: 'multiple-choice', hint: 'A noun names a person, place, or thing.', options: ['run', 'happy', 'book'], correct_answer: 2, explanation: 'Correct! "Book" is a noun—it names a thing.' },
      { emoji: '📦', question: 'Is "teacher" a common or proper noun?', question_type: 'multiple-choice', hint: 'Common nouns are general; proper nouns are specific names.', options: ['Common noun', 'Proper noun'], correct_answer: 0, explanation: 'Correct! "Teacher" is a common noun. "Mr. Smith" would be a proper noun.' }
    ]
  },
  resources: {
    'Noun': [
      { title: 'Nouns Explained', url: 'https://www.youtube.com/embed/8SdLnhVS6qs', description: 'A comprehensive guide to understanding nouns.', resource_type: 'video', video_embed_id: '8SdLnhVS6qs' },
      { title: 'Grammar Guide', url: 'https://www.grammarly.com/blog/noun/', description: 'In-depth article about nouns from Grammarly.', resource_type: 'article' }
    ]
  }
};

async function seedGrammarData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync database
    await sequelize.sync({ alter: false });
    console.log('✅ Tables synced');

    // Seed Parts of Speech
    console.log('📚 Seeding parts of speech...');
    const parts = await Promise.all(
      grammarData.parts.map(part =>
        PartOfSpeech.findOrCreate({
          where: { name: part.name },
          defaults: part
        }).then(([createdPart]) => createdPart)
      )
    );
    console.log(`✅ Created/found ${parts.length} parts of speech`);

    // Seed Types for Noun
    const nounPart = parts.find(p => p.name === 'Noun');
    if (nounPart && grammarData.types['Noun']) {
      console.log('📚 Seeding noun types...');
      await Promise.all(
        grammarData.types['Noun'].map(type =>
          GrammarType.findOrCreate({
            where: { part_id: nounPart.id, name: type.name },
            defaults: { ...type, part_id: nounPart.id }
          })
        )
      );
      console.log('✅ Seeded noun types');
    }

    // Seed Types for Pronoun
    const pronounPart = parts.find(p => p.name === 'Pronoun');
    if (pronounPart && grammarData.types['Pronoun']) {
      console.log('📚 Seeding pronoun types...');
      await Promise.all(
        grammarData.types['Pronoun'].map(type =>
          GrammarType.findOrCreate({
            where: { part_id: pronounPart.id, name: type.name },
            defaults: { ...type, part_id: pronounPart.id }
          })
        )
      );
      console.log('✅ Seeded pronoun types');
    }

    // Seed Rules
    const nounRules = grammarData.rules['Noun'];
    if (nounPart && nounRules) {
      console.log('📚 Seeding noun rules...');
      await Promise.all(
        nounRules.map(rule =>
          GrammarRule.findOrCreate({
            where: { part_id: nounPart.id, rule_type: rule.rule_type },
            defaults: { ...rule, part_id: nounPart.id }
          })
        )
      );
      console.log('✅ Seeded noun rules');
    }

    // Seed Exercises
    const nounExercises = grammarData.exercises['Noun'];
    if (nounPart && nounExercises) {
      console.log('📚 Seeding noun exercises...');
      await Promise.all(
        nounExercises.map(exercise =>
          GrammarExercise.findOrCreate({
            where: { part_id: nounPart.id, title: exercise.title },
            defaults: { ...exercise, part_id: nounPart.id }
          })
        )
      );
      console.log('✅ Seeded noun exercises');
    }

    // Seed Quiz Questions
    const nounQuiz = grammarData.quiz['Noun'];
    if (nounPart && nounQuiz) {
      console.log('📚 Seeding noun quiz...');
      await Promise.all(
        nounQuiz.map((q, idx) =>
          GrammarQuizQuestion.findOrCreate({
            where: { part_id: nounPart.id, question: q.question },
            defaults: { ...q, part_id: nounPart.id }
          })
        )
      );
      console.log('✅ Seeded noun quiz');
    }

    // Seed Resources
    const nounResources = grammarData.resources['Noun'];
    if (nounPart && nounResources) {
      console.log('📚 Seeding noun resources...');
      await Promise.all(
        nounResources.map(resource =>
          GrammarResource.findOrCreate({
            where: { part_id: nounPart.id, title: resource.title },
            defaults: { ...resource, part_id: nounPart.id }
          })
        )
      );
      console.log('✅ Seeded noun resources');
    }

    console.log('✅ Grammar seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding grammar data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedGrammarData();
}

module.exports = seedGrammarData;
