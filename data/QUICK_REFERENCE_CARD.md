# 🎯 Content Creation - Quick Reference Card

## 📋 2 Files Required

```
✅ {topic}_learning.json  (Teaching content)
✅ {topic}_quiz.json       (Practice questions)
```

---

## 📖 Learning File Checklist

```json
{
  "part_id": 10,                    ← Unique number
  "name": "Topic Name",             ← Clear topic name
  "definition": "...",              ← What is it?
  "importance": "...",              ← Why learn it?
  "icon": "📰",                     ← Emoji icon
  "tagline": "...",                 ← Catchy phrase
  "color": "#10b981",               ← Hex color
  
  "types": [...]                    ← 3-8 types
  "rules": [...]                    ← 4-6 rules
  "examples": [...]                 ← 6-10 examples
  "exercises": [...]                ← 2-3 exercises
  "common_mistakes": [...]          ← 5-8 mistakes
  "quick_facts": [...]              ← 8-10 facts
  "videos": [...]                   ← 3-5 videos
  "resources": [...]                ← 3-5 resources
  "metadata": {...}                 ← Info
}
```

---

## 📝 Quiz File Checklist

```json
{
  "part_id": 10,                    ← Same as learning file
  "part_name": "Topic Name",        ← Same name
  
  "quiz_content": {
    "mcq": {
      "easy": [...]                 ← 10+ questions
      "medium": [...]               ← 10+ questions
      "hard": [...]                 ← 5+ questions
    },
    "fill_in_blank": {
      "easy": [...]                 ← 8+ questions
      "medium": [...]               ← 5+ questions
      "hard": [...]                 ← 3+ questions
    },
    "reading_comprehension": [...]  ← 2+ passages
    "writing_exercises": [...]      ← 3+ exercises
  }
}
```

---

## 🎨 Field Types Quick Guide

### Text Fields
```json
"name": "Text here"
"definition": "Longer text explanation"
```

### Numbers
```json
"part_id": 10
"correct_answer": 1
```

### Arrays (Lists)
```json
"examples": ["item1", "item2", "item3"]
"points": ["point 1", "point 2"]
```

### Objects (Nested Data)
```json
{
  "id": 1,
  "name": "Type Name",
  "description": "Description here"
}
```

---

## ✅ Validation Checklist

### Before Submitting:
- [ ] JSON validated on jsonlint.com
- [ ] Both files created
- [ ] part_id matches in both
- [ ] All required sections filled
- [ ] Minimum content requirements met
- [ ] Grammar checked
- [ ] Examples tested
- [ ] File names correct
- [ ] Color codes valid (hex)
- [ ] No syntax errors

---

## 📊 Minimum Content Requirements

| Section | Minimum |
|---------|---------|
| Types | 3 |
| Rules | 4 |
| Examples | 6 |
| Exercises | 2 |
| Common Mistakes | 5 |
| Quick Facts | 8 |
| Videos | 3 |
| Resources | 3 |
| Easy MCQ | 10 |
| Medium MCQ | 10 |
| Hard MCQ | 5 |
| Fill-in-Blank | 8 |
| Reading Passages | 2 |
| Writing Exercises | 3 |

---

## 🚦 Quality Rules

### ✅ DO:
- Use clear, simple language
- Provide real-world examples
- Include diverse questions
- Explain correct AND incorrect
- Use emojis strategically
- Test content yourself
- Follow the structure

### ❌ DON'T:
- Use technical jargon
- Skip explanations
- Rush the process
- Forget to proofread
- Ignore the template
- Mix up quotes
- Leave sections empty

---

## 🎯 MCQ Question Template

```json
{
  "id": 1,
  "question": "Your question here?",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correct_answer": 1,           ← 0=A, 1=B, 2=C, 3=D
  "explanation": "Why B is correct..."
}
```

---

## 📝 Fill-in-Blank Template

```json
{
  "id": 1,
  "question": "I saw ___ elephant.",
  "expected_answer": "an",
  "explanation": "Use 'an' before vowel sounds."
}
```

---

## 📖 Reading Passage Template

```json
{
  "id": 1,
  "title": "Passage Title",
  "passage": "Full text here...",
  "difficulty": "easy",
  "questions": [
    {
      "id": 1,
      "question": "Question?",
      "options": ["A", "B", "C", "D"],
      "correct_answer": 1,
      "explanation": "Explanation"
    }
  ]
}
```

---

## 🎨 Color Palette

```
Blue:   #3b82f6  (Standard)
Green:  #10b981  (Success)
Orange: #f59e0b  (Warning)
Red:    #ef4444  (Error)
Purple: #8b5cf6  (Special)
Pink:   #ec4899  (Creative)
```

---

## 🔍 Common JSON Mistakes

### ❌ Wrong:
```json
{
  "name": 'Single quotes'        ← Use double quotes
  "items": ["one", "two"]        ← Missing comma
  "other": "value"
  "last": "item",                ← Extra comma
}
```

### ✅ Correct:
```json
{
  "name": "Double quotes",
  "items": ["one", "two"],
  "other": "value",
  "last": "item"
}
```

---

## 📂 File Naming

### ✅ Correct:
- `articles_learning.json`
- `present_tense_learning.json`
- `adjectives_quiz.json`

### ❌ Wrong:
- `Articles Learning.json` (spaces)
- `article-learning.json` (hyphens)
- `articles.json` (missing suffix)
- `ARTICLES_LEARNING.json` (uppercase)

---

## 🚀 Quick Start Steps

1. **Copy sample files**
   - `SAMPLE_articles_learning.json`
   - `SAMPLE_articles_quiz.json`

2. **Replace content**
   - Keep structure
   - Change text only

3. **Validate JSON**
   - Use jsonlint.com
   - Fix errors

4. **Submit**
   - Both files
   - Filled form
   - Wait for feedback

---

## 📞 Get Help

### Documentation:
- `QUICK_START_CONTENT_CREATORS.md`
- `CONTENT_CREATION_TEMPLATE.md`
- `CONTENT_SYSTEM_SUMMARY.md`

### Sample Files:
- `SAMPLE_articles_learning.json`
- `SAMPLE_articles_quiz.json`
- `nouns_learning.json`

### Tools:
- JSON Validator: jsonlint.com
- Color Picker: htmlcolorcodes.com
- Grammar Check: grammarly.com

---

## 💡 Pro Tips

1. **Start with samples** - Best reference
2. **Validate often** - Check JSON frequently
3. **Keep it simple** - Clear > complex
4. **Test yourself** - Answer your questions
5. **Get feedback** - Ask others to review
6. **Be consistent** - Follow patterns
7. **Have fun!** - Make it engaging

---

## ⏱️ Time Estimates

- **Simple topic**: 2-4 hours
- **Complex topic**: 4-8 hours
- **Review & edit**: 1-2 hours
- **Total**: 3-10 hours per topic

---

## 🎓 Topic Ideas

**Beginner:**
- Articles
- Present Simple
- Plural Nouns
- Basic Adjectives

**Intermediate:**
- Present Perfect
- Passive Voice
- Conditionals
- Modal Verbs

**Advanced:**
- Reported Speech
- Mixed Conditionals
- Advanced Grammar
- Idioms

---

## ✨ Quality Formula

```
Great Content = 
  Clear Explanation
  + Good Examples
  + Practice Questions
  + Helpful Feedback
```

---

**Print this card and keep it handy while creating content!** 📌

*Version 1.0 | Nov 25, 2025*
