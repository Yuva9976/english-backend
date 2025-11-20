# 📚 How to Prepare Backend Data - Quick Setup Guide

## Step 1: Verify Your Data Files

Make sure you have all 8 JSON files in `english-backend/data/`:

```
english-backend/data/
├── nouns_learning.json (pre-existing)
├── nouns_quiz.json (pre-existing)
├── pronouns_learning.json ✅
├── pronouns_quiz.json ✅
├── verbs_learning.json ✅
├── verbs_quiz.json ✅
├── adjectives_learning.json ✅
├── adjectives_quiz.json ✅
├── adverbs_learning.json ✅
├── adverbs_quiz.json ✅
├── prepositions_learning.json ✅
├── prepositions_quiz.json ✅
├── conjunctions_learning.json ✅
├── conjunctions_quiz.json ✅
├── interjections_learning.json ✅
└── interjections_quiz.json ✅
```

All files are now created! ✨

---

## Step 2: Run the Seed Script

This command loads all the data into your database:

```bash
cd english-backend
node seed_parts_of_speech.js
```

**Expected Output:**
```
✅ Database connection established
✅ Models synchronized
📚 Loading data files...
  ✅ nouns: learning & quiz data loaded
  ✅ pronouns: learning & quiz data loaded
  ✅ verbs: learning & quiz data loaded
  ✅ adjectives: learning & quiz data loaded
  ✅ adverbs: learning & quiz data loaded
  ✅ prepositions: learning & quiz data loaded
  ✅ conjunctions: learning & quiz data loaded
  ✅ interjections: learning & quiz data loaded

🌱 Starting seed process...

━━━ Seeding Noun (ID: 1) ━━━
  ✓ Part of Speech: "Noun" (created)
  ✓ Types: 4 created
  ✓ Rules: 5 created
  ✓ Examples: 8 created
  ✓ Exercises: 2 created
  ✓ Resources: 5 created
  ✓ Quiz Questions: 90 created
  ✨ "Noun" seeded successfully!

[... similar for other 7 parts ...]

==================================================
✅ Seeding completed! 8/8 parts of speech seeded
==================================================

📊 Summary:
  • All parts of speech created
  • Types, rules, examples loaded
  • Exercises and resources added
  • Quiz questions populated

🚀 Ready to use! Your API endpoints:
  GET  /api/grammar/parts-of-speech
  GET  /api/grammar/parts-of-speech/:id
  GET  /api/grammar/parts-of-speech/:id/quiz
```

---

## Step 3: Verify Database Loaded Data

### Option A: Use psql (PostgreSQL CLI)

```bash
# Connect to your database
psql -U postgres -d english_portal

# Check parts of speech
SELECT id, name, icon FROM parts_of_speech;

# Check types for Noun (part_id = 1)
SELECT id, name FROM grammar_types WHERE part_id = 1;

# Check quiz questions
SELECT COUNT(*) as total_questions FROM grammar_quiz_questions;

# Quit
\q
```

### Option B: Write a Quick Node Verification Script

Create `verify_data.js`:

```javascript
const { PartOfSpeech } = require('./models/grammar');

async function verify() {
  try {
    const parts = await PartOfSpeech.findAll({
      include: ['types', 'rules', 'examples', 'exercises', 'quiz', 'resources']
    });

    console.log('\n📊 Data Summary:\n');
    for (const part of parts) {
      console.log(`${part.icon} ${part.name}`);
      console.log(`   Types: ${part.types.length}`);
      console.log(`   Rules: ${part.rules.length}`);
      console.log(`   Examples: ${part.examples.length}`);
      console.log(`   Exercises: ${part.exercises.length}`);
      console.log(`   Quiz: ${part.quiz.length}`);
      console.log(`   Resources: ${part.resources.length}\n`);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

verify();
```

Run it: `node verify_data.js`

---

## Step 4: Check Your API Endpoints

Make sure your grammar API routes are set up. Check `english-backend/routes/grammar.js`:

```javascript
// GET all parts of speech
router.get('/parts-of-speech', async (req, res) => {
  const parts = await PartOfSpeech.findAll({
    include: ['types', 'rules', 'examples', 'exercises', 'resources']
  });
  res.json(parts);
});

// GET specific part with all details
router.get('/parts-of-speech/:id', async (req, res) => {
  const part = await PartOfSpeech.findByPk(req.params.id, {
    include: ['types', 'rules', 'examples', 'exercises', 'quiz', 'resources']
  });
  if (!part) return res.status(404).json({ error: 'Not found' });
  res.json(part);
});

// GET quiz for specific part
router.get('/parts-of-speech/:id/quiz', async (req, res) => {
  const quiz = await GrammarQuizQuestion.findAll({
    where: { part_id: req.params.id }
  });
  res.json(quiz);
});
```

---

## Step 5: Start Your Backend Server

```bash
cd english-backend
npm run dev
```

Then test your API:

```bash
# Get all parts
curl http://localhost:5000/api/grammar/parts-of-speech

# Get specific part (e.g., Pronoun - ID: 2)
curl http://localhost:5000/api/grammar/parts-of-speech/2

# Get quiz questions
curl http://localhost:5000/api/grammar/parts-of-speech/2/quiz
```

---

## Step 6: Connect Frontend to API

In `english-frontend/src/apiClient.js`, add endpoints:

```javascript
export const fetchPartOfSpeech = async (id) => {
  const response = await fetch(`${API_URL}/api/grammar/parts-of-speech/${id}`);
  return response.json();
};

export const fetchAllParts = async () => {
  const response = await fetch(`${API_URL}/api/grammar/parts-of-speech`);
  return response.json();
};

export const fetchQuizQuestions = async (partId) => {
  const response = await fetch(`${API_URL}/api/grammar/parts-of-speech/${partId}/quiz`);
  return response.json();
};
```

---

## 🎯 Complete Data Structure

### What Gets Seeded:

| Item | Count | Source |
|------|-------|--------|
| **Parts of Speech** | 8 | `part_id` in each JSON |
| **Grammar Types** | ~4 per part = 32 | `types[]` array |
| **Grammar Rules** | ~5 per part = 40 | `rules[]` array |
| **Examples** | ~8 per part = 64 | `examples[]` array |
| **Exercises** | ~2 per part = 16 | `exercises[]` array |
| **Resources** | ~5 per part = 40 | `videos[]` + `resources[]` |
| **Quiz Questions** | ~50-100 per part = 600+ | `mcq[]` + `fill_in_blank[]` + `reading_comprehension[]` |

---

## 🔧 Troubleshooting

### Problem: "Cannot find module 'pg'"
**Solution:** Install dependencies
```bash
cd english-backend
npm install
```

### Problem: "Database connection refused"
**Solution:** Check your `.env` file
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=english_portal
DB_PORT=5432
```

### Problem: "File not found" for JSON files
**Solution:** Verify files are in `english-backend/data/` directory
```bash
ls english-backend/data/ | grep learning.json
# Should show: 8 files
```

### Problem: "UNIQUE constraint failed"
**Solution:** Clean and reseed
```bash
# Drop and recreate tables
psql -U postgres -d english_portal -c "DROP TABLE IF EXISTS grammar_resources, grammar_quiz_questions, grammar_exercises, grammar_examples, grammar_rules, grammar_types, parts_of_speech;"

# Then run seed again
node seed_parts_of_speech.js
```

---

## ✅ Verification Checklist

After running the seed script, verify:

- [ ] 8 parts of speech in database
- [ ] Each part has 3-4 types
- [ ] Each part has 5 rules
- [ ] Each part has 8 examples
- [ ] Each part has 2 exercises
- [ ] Each part has 5+ resources
- [ ] Each part has 50-100 quiz questions
- [ ] API endpoints working (test with curl)
- [ ] Frontend can fetch data from API

---

## 📝 Summary

**3 Simple Steps:**

1. **Verify files exist** → Check `english-backend/data/` folder
2. **Run seed script** → `node seed_parts_of_speech.js`
3. **Test API** → `curl http://localhost:5000/api/grammar/parts-of-speech`

Done! ✨ Your backend data is ready!
