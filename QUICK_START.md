# 🚀 Quick Start Guide

## One-Time Setup

```bash
cd english-backend

# 1. Install dependencies (if not done)
npm install

# 2. Load the data into database
node seed_parts_of_speech.js

# 3. Verify data loaded correctly
node verify_data.js
```

## Running the Backend

```bash
cd english-backend
npm start
```

**Output should show:**
```
✅ Server running on http://localhost:3000
✅ Database connected
```

## Testing the API

### Get All Parts of Speech
```bash
curl http://localhost:3000/api/grammar
```

### Get Pronouns with All Details
```bash
curl http://localhost:3000/api/grammar/10
```

### Get Just Quiz Questions for Pronouns
```bash
curl http://localhost:3000/api/grammar/10/quiz
```

### Get Grammar Rules for Verbs
```bash
curl http://localhost:3000/api/grammar/11/rules
```

## Available Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/grammar` | Get all parts of speech |
| GET | `/api/grammar/:id` | Get part with all data |
| GET | `/api/grammar/:id/types` | Get grammar types |
| GET | `/api/grammar/:id/rules` | Get grammar rules |
| GET | `/api/grammar/:id/examples` | Get examples |
| GET | `/api/grammar/:id/exercises` | Get exercises |
| GET | `/api/grammar/:id/quiz` | Get quiz questions |
| GET | `/api/grammar/:id/resources` | Get resources |

## Part IDs

Use these IDs in API calls:
- 10 = Pronoun (60 questions)
- 11 = Verb (37 questions)
- 12 = Adjective (60 questions)
- 13 = Adverb (40 questions)
- 14 = Preposition (40 questions)
- 15 = Conjunction (40 questions)
- 16 = Interjection (40 questions)

## Data

- **Location**: `english-backend/data/` (14 JSON files)
- **Size**: ~150KB total
- **Parts**: 7 complete parts of speech
- **Questions**: 320+ quiz questions
- **Format**: MCQ and Fill-in-the-Blank

## If Something Goes Wrong

```bash
# Re-seed the database
node seed_parts_of_speech.js

# Check what's in the database
node verify_data.js

# Check database connection
npm test
```

## Database Info

- **Type**: PostgreSQL
- **Name**: `english_portal`
- **User**: `myuser`
- **Password**: See `.env` file
- **Host**: `localhost`
- **Port**: `5432`

---

That's it! Your backend is ready to serve the grammar learning materials to your frontend. 🎉
