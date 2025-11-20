// Check existing parts
const { PartOfSpeech } = require('./models/grammar');

async function check() {
  try {
    const parts = await PartOfSpeech.findAll();
    console.log('\n📋 Existing Parts of Speech in Database:\n');
    for (const part of parts) {
      console.log(`  ID: ${part.id} → Name: "${part.name}"`);
    }
    console.log('\nTotal:', parts.length);
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
}

check();
