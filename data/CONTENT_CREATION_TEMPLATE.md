# 📚 Content Creation Template Guide

## Overview
To add new topics/lessons to your English learning platform, you need **2 JSON files** per topic:

1. **`{topic}_learning.json`** - Learning content with theory, examples, rules
2. **`{topic}_quiz.json`** - Quiz content with questions, exercises

---

## 📋 File 1: Learning Content Structure

### File Name: `{topic}_learning.json`
Example: `articles_learning.json`, `tenses_learning.json`

### Required Fields:

```json
{
  "part_id": 10,  // Unique ID number
  "name": "Topic Name",  // e.g., "Articles", "Present Tense"
  "definition": "Clear definition of the topic",
  "importance": "Why this topic matters",
  "icon": "📰",  // Emoji icon
  "tagline": "Catchy tagline",
  "color": "#10b981",  // Hex color code
  
  "types": [
    {
      "id": 1,
      "name": "Type Name",
      "emoji": "🎯",
      "description": "What this type is",
      "examples": ["example1", "example2", "example3"],
      "color": "#3b82f6",
      "rule": "Main rule for this type"
    }
  ],
  
  "rules": [
    {
      "type": "do",  // or "dont"
      "title": "DO: Rule Title",
      "points": [
        "Point 1",
        "Point 2",
        "Point 3"
      ],
      "examples": [
        "✅ Example 1",
        "✅ Example 2"
      ]
    }
  ],
  
  "examples": [
    {
      "sentence": "Example sentence using the concept",
      "usage_pattern": "How it's used",
      "category": "Category name",
      "noun_type": "Type classification"
    }
  ],
  
  "exercises": [
    {
      "type": "writing",  // or "reading"
      "title": "Exercise Title",
      "prompt": "Instructions for students",
      "sample_answer": "Model answer"
    }
  ],
  
  "common_mistakes": [
    {
      "error": "Wrong way",
      "correct": "Correct way",
      "explanation": "Why it's wrong and how to fix"
    }
  ],
  
  "quick_facts": [
    "Interesting fact 1",
    "Interesting fact 2",
    "Interesting fact 3"
  ],
  
  "videos": [
    {
      "title": "Video Title",
      "url": "https://www.youtube.com/watch?v=VIDEO_ID",
      "description": "What the video covers",
      "duration": "12 mins",
      "difficulty": "Beginner"
    }
  ],
  
  "resources": [
    {
      "title": "Resource Title",
      "url": "https://example.com",
      "description": "What this resource provides",
      "type": "Reference"  // or "Practice", "Guide", "Dictionary"
    }
  ],
  
  "metadata": {
    "created_date": "2025-11-25",
    "version": "1.0",
    "total_types": 4,
    "total_rules": 6,
    "difficulty_level": "Beginner",
    "estimated_learning_time": "1-2 hours",
    "tags": ["tag1", "tag2", "tag3"]
  }
}
```

---

## 📋 File 2: Quiz Content Structure

### File Name: `{topic}_quiz.json`
Example: `articles_quiz.json`, `tenses_quiz.json`

### Required Fields:

```json
{
  "part_id": 10,  // Same ID as learning file
  "part_name": "Topic Name",  // Same name
  
  "quiz_content": {
    "mcq": {
      "easy": [
        {
          "id": 1,
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_answer": 1,  // Index: 0=A, 1=B, 2=C, 3=D
          "explanation": "Why this answer is correct"
        }
      ],
      "medium": [
        // Same structure as easy, 10+ questions
      ],
      "hard": [
        // Same structure, 5+ questions
      ]
    },
    
    "fill_in_blank": {
      "easy": [
        {
          "id": 1,
          "question": "I saw ___ elephant.",
          "expected_answer": "an",
          "explanation": "Why this is the answer"
        }
      ],
      "medium": [
        // Same structure
      ],
      "hard": [
        // Same structure
      ]
    },
    
    "reading_comprehension": [
      {
        "id": 1,
        "title": "Passage Title",
        "passage": "Full text of the reading passage...",
        "difficulty": "easy",  // or "medium", "hard"
        "questions": [
          {
            "id": 1,
            "question": "Question about the passage?",
            "options": ["A", "B", "C", "D"],
            "correct_answer": 0,
            "explanation": "Why this answer is correct"
          }
        ]
      }
    ],
    
    "writing_exercises": [
      {
        "difficulty": "easy",
        "title": "Exercise Title",
        "instruction": "What students should do",
        "prompt": "Detailed instructions and examples",
        "model_answer": "Example of good answer",
        "criteria": [
          "Criterion 1 for evaluation",
          "Criterion 2",
          "Criterion 3"
        ]
      }
    ]
  }
}
```

---

## 🎯 Content Guidelines

### 1. **Learning Content (`_learning.json`)**
- **Minimum Types**: 3-8 types/categories
- **Rules**: At least 4-6 rules (mix of DO and DON'T)
- **Examples**: 6-10 practical examples
- **Exercises**: 2-3 varied exercises
- **Common Mistakes**: 5-8 mistakes
- **Quick Facts**: 8-10 interesting facts
- **Videos**: 3-5 video resources
- **Resources**: 3-5 additional resources

### 2. **Quiz Content (`_quiz.json`)**
- **Easy MCQ**: 10+ questions
- **Medium MCQ**: 10+ questions
- **Hard MCQ**: 5+ questions
- **Fill in Blank**: 8+ easy, 5+ medium, 3+ hard
- **Reading Comprehension**: 2+ passages with 4+ questions each
- **Writing Exercises**: 3+ (easy, medium, hard)

---

## ✅ Quality Checklist

Before submitting content, ensure:

- [ ] Both JSON files are valid (no syntax errors)
- [ ] `part_id` matches in both files
- [ ] All required fields are present
- [ ] Examples are clear and practical
- [ ] Explanations are beginner-friendly
- [ ] Quiz answers are correct
- [ ] Color codes are valid hex values
- [ ] URLs are working (if applicable)
- [ ] Grammar and spelling are correct
- [ ] Content follows a logical progression

---

## 🚀 How to Use This Template

### Step 1: Copy the Sample Files
Use `SAMPLE_articles_learning.json` and `SAMPLE_articles_quiz.json` as reference.

### Step 2: Create Your Content
1. Create `{your_topic}_learning.json`
2. Create `{your_topic}_quiz.json`
3. Fill in all sections

### Step 3: Validate JSON
- Use an online JSON validator
- Check for missing commas, brackets, quotes

### Step 4: Submit to Backend
Place files in `english-backend/data/` folder

### Step 5: Run Seeder Script
```bash
node seed_your_topic.js
```

---

## 📁 File Naming Convention

✅ **Correct:**
- `articles_learning.json`
- `present_tense_learning.json`
- `sentence_structure_learning.json`

❌ **Incorrect:**
- `Articles Learning.json` (no spaces)
- `article-learning.json` (use underscore)
- `articles.json` (missing _learning suffix)

---

## 💡 Content Writing Tips

### For Learning Content:
1. **Start Simple**: Begin with basic definitions
2. **Use Examples**: Every rule needs 3+ examples
3. **Visual Aids**: Use emojis and colors strategically
4. **Real-World**: Use practical, relatable examples
5. **Progressive**: Order from easy to difficult

### For Quiz Content:
1. **Clear Questions**: No ambiguous wording
2. **Plausible Options**: Wrong answers should seem reasonable
3. **Good Explanations**: Explain why it's correct AND why others are wrong
4. **Variety**: Mix different question types
5. **Balanced Difficulty**: Don't make everything too hard or too easy

---

## 🔧 Testing Your Content

After creating files, test:

1. **JSON Validity**: Use https://jsonlint.com/
2. **Content Flow**: Read through as a student
3. **Quiz Accuracy**: Double-check all answers
4. **Examples Quality**: Are they helpful?
5. **Completeness**: All sections filled?

---

## 📞 Need Help?

**Check sample files:**
- `SAMPLE_articles_learning.json` - Complete learning example
- `SAMPLE_articles_quiz.json` - Complete quiz example
- `nouns_learning.json` - Production example
- `nouns_quiz.json` - Production example

**Common Issues:**
- Missing comma in JSON → Use JSON validator
- Wrong part_id → Must match in both files
- Invalid color code → Use hex format (#xxxxxx)
- Empty arrays → Add at least 1 item to each array

---

## 📊 Content Structure Summary

```
Topic Name (e.g., "Articles")
├── Learning File (_learning.json)
│   ├── Basic Info (name, definition, icon)
│   ├── Types (3-8 types with examples)
│   ├── Rules (DOs and DON'Ts)
│   ├── Examples (practical usage)
│   ├── Exercises (practice activities)
│   ├── Common Mistakes
│   ├── Quick Facts
│   ├── Videos
│   ├── Resources
│   └── Metadata
│
└── Quiz File (_quiz.json)
    ├── MCQ (easy, medium, hard)
    ├── Fill in Blank
    ├── Reading Comprehension
    └── Writing Exercises
```

---

## 🎨 Color Palette Suggestions

- **Blue**: `#3b82f6` - Standard/Neutral
- **Green**: `#10b981` - Success/Positive
- **Orange**: `#f59e0b` - Warning/Important
- **Red**: `#ef4444` - Error/Don't
- **Purple**: `#8b5cf6` - Special/Unique
- **Pink**: `#ec4899` - Creative/Fun

---

Good luck creating amazing content! 🚀
