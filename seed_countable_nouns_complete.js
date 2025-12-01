const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('english_portal', 'myuser', 'mayu', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

const countableNounsData = {
  "overview": {
    "title": "What are Countable Nouns?",
    "description": "Countable nouns are nouns that can be counted individually—they have both singular and plural forms. These are the nouns you can put numbers before: one book, two books, three books. They represent distinct, separate items that can be quantified.",
    "definition": "A countable noun is a noun that refers to something that can be counted and has both singular and plural forms.",
    "key_points": [
      "Countable nouns can be counted: one apple, two apples, three apples",
      "They have both singular and plural forms",
      "Use 'a/an' with singular countable nouns: a dog, an elephant",
      "Use numbers directly: five cars, ten students, fifty books",
      "Can use many/few with countable nouns, not much/little",
      "Examples: cat/cats, book/books, child/children, person/people"
    ],
    "importance": "Understanding countable nouns is essential for correct article usage, subject-verb agreement, and using the right quantifiers. Mastering countable nouns helps you speak and write English more naturally and accurately.",
    "common_words": ["apple", "book", "car", "cat", "chair", "computer", "dog", "friend", "house", "pen", "phone", "student", "table", "teacher", "tree", "window", "cup", "shoe", "key", "coin"]
  },
  "detailed_explanation": {
    "sections": [
      {
        "title": "Understanding Countable Nouns",
        "content": "Countable nouns are the most common type of noun in English. They represent things that exist as separate, individual units—things you can count one by one. Unlike uncountable nouns (water, rice, information), countable nouns have distinct boundaries and can be pluralized.",
        "subsections": [
          {
            "subtitle": "The Counting Test",
            "text": "To identify a countable noun, try putting numbers before it. Can you say 'one dog, two dogs, three dogs'? Yes! That's countable. Can you say 'one water, two waters, three waters'? No (unless you mean glasses/bottles of water). Water is uncountable in its natural form.",
            "examples": ["Countable: one car, two cars, three cars", "Countable: one idea, two ideas, three ideas", "Uncountable: one water ✗ (but: one glass of water ✓)", "Uncountable: one advice ✗ (but: one piece of advice ✓)"]
          },
          {
            "subtitle": "Singular vs. Plural Forms",
            "text": "Countable nouns change form when going from one to many. Regular plurals add -s or -es (book/books, box/boxes). Irregular plurals change completely (child/children, person/people). Some remain the same (sheep/sheep, fish/fish). This flexibility is the hallmark of countable nouns.",
            "examples": ["Regular: cat → cats, dog → dogs, chair → chairs", "Add -es: box → boxes, church → churches, dish → dishes", "Irregular: child → children, tooth → teeth, mouse → mice", "Unchanged: sheep → sheep, fish → fish, deer → deer"]
          },
          {
            "subtitle": "Articles and Determiners",
            "text": "Countable nouns work with specific articles and determiners. Singular countable nouns usually require an article (a, an, the) or determiner (this, that, my, your). Plural countable nouns can stand alone or use determiners. This contrasts with uncountable nouns, which never use a/an.",
            "examples": ["Singular: a book, an apple, the car, my phone", "Plural: books, some books, many books, these books", "Uncountable: water (not 'a water'), advice (not 'an advice')"]
          }
        ]
      },
      {
        "title": "Using Countable Nouns Correctly",
        "content": "Proper use of countable nouns involves understanding article usage, subject-verb agreement, and appropriate quantifiers. These rules help create grammatically correct and natural-sounding English.",
        "subsections": [
          {
            "subtitle": "Quantifiers with Countable Nouns",
            "text": "Countable nouns pair with specific quantifiers: 'many' (not much), 'few' (not little), 'a couple of,' 'several,' and 'a number of.' Using the wrong quantifier is a common mistake for English learners.",
            "examples": ["Correct: many books, few students, several chairs", "Incorrect: much books ✗, little students ✗", "Correct: How many apples do you want?", "Incorrect: How much apples do you want? ✗"]
          },
          {
            "subtitle": "Subject-Verb Agreement",
            "text": "Singular countable nouns take singular verbs; plural countable nouns take plural verbs. This agreement is fundamental to English grammar and affects sentence clarity and correctness.",
            "examples": ["Singular: The book is on the table", "Plural: The books are on the table", "Singular: A student has arrived", "Plural: Students have arrived"]
          }
        ]
      }
    ]
  },
  "video_resources": [
    {
      "title": "Countable and Uncountable Nouns Explained",
      "platform": "YouTube",
      "duration": "10:25",
      "description": "Comprehensive guide to identifying and using countable nouns with clear examples and practice",
      "key_topics": ["Definition", "Examples", "Plurals", "Articles", "Quantifiers"]
    },
    {
      "title": "Countable Nouns: Articles and Determiners",
      "platform": "YouTube",
      "duration": "8:15",
      "description": "Focus on using a/an/the and other determiners correctly with countable nouns",
      "key_topics": ["Article usage", "Determiners", "Common mistakes", "Practice exercises"]
    },
    {
      "title": "Mastering Plural Forms of Countable Nouns",
      "platform": "YouTube",
      "duration": "12:40",
      "description": "Learn regular and irregular plural forms with pronunciation guide and memory tricks",
      "key_topics": ["Regular plurals", "Irregular plurals", "Pronunciation", "Special cases"]
    }
  ],
  "grammar_rules": {
    "title": "Countable Nouns Grammar Rules",
    "rules": [
      {
        "rule": "Singular countable nouns need an article or determiner",
        "explanation": "You cannot use a singular countable noun alone; it needs 'a/an,' 'the,' or a determiner (my, this, that, etc.)",
        "examples": ["Correct: a book, an apple, the car, my phone", "Incorrect: Book is on table ✗", "Correct: The book is on the table ✓"]
      },
      {
        "rule": "Use 'a' before consonant sounds, 'an' before vowel sounds",
        "explanation": "The choice between 'a' and 'an' depends on the sound (not spelling) that follows",
        "examples": ["a cat, a dog, a university (y sound)", "an apple, an elephant, an hour (silent h)"]
      },
      {
        "rule": "Plural countable nouns can stand alone",
        "explanation": "Unlike singular countable nouns, plurals don't require an article and can be used generally",
        "examples": ["Dogs are loyal animals", "Books are expensive", "I like apples"]
      },
      {
        "rule": "Use 'many' and 'few' with countable nouns",
        "explanation": "Countable nouns take 'many' for large quantities and 'few' for small quantities",
        "examples": ["many books, few students, a few chairs", "NOT: much books ✗, little students ✗"]
      },
      {
        "rule": "Subject-verb agreement follows the number",
        "explanation": "Singular countable nouns use singular verbs; plural use plural verbs",
        "examples": ["The dog runs fast", "Dogs run fast", "A child is playing", "Children are playing"]
      },
      {
        "rule": "Can use numbers directly",
        "explanation": "You can put any number directly before countable nouns",
        "examples": ["one apple, two apples, twenty students", "fifty books, a hundred cars, thousands of people"]
      }
    ]
  },
  "examples": {
    "categories": [
      {
        "category": "People & Animals",
        "icon": "👥",
        "examples": [
          {
            "sentence": "Three students are studying in the library.",
            "analysis": "'Students' is countable—you can count individual students (one student, two students, three students)"
          },
          {
            "sentence": "A cat sat on the wall watching two birds.",
            "analysis": "'Cat' and 'birds' are countable—you can count them individually and they have singular/plural forms"
          },
          {
            "sentence": "The teacher gave each child an apple.",
            "analysis": "'Teacher,' 'child,' and 'apple' are all countable with distinct singular and plural forms"
          },
          {
            "sentence": "Five doctors work at this hospital.",
            "analysis": "'Doctors' and 'hospital' are countable—you can count individual doctors and hospitals"
          },
          {
            "sentence": "My brother has two dogs and three cats.",
            "analysis": "'Brother,' 'dogs,' and 'cats' are countable—each represents a distinct, countable entity"
          }
        ]
      },
      {
        "category": "Objects & Things",
        "icon": "📦",
        "examples": [
          {
            "sentence": "She bought a new car and two bicycles.",
            "analysis": "'Car' and 'bicycles' are countable—vehicles are individual, distinct items you can count"
          },
          {
            "sentence": "Ten books are stacked on the table.",
            "analysis": "'Books' and 'table' are countable—each book is a separate unit that can be counted"
          },
          {
            "sentence": "He has a computer, a phone, and two tablets.",
            "analysis": "All four nouns are countable electronic devices that exist as separate units"
          },
          {
            "sentence": "The shop sells chairs, tables, and sofas.",
            "analysis": "All furniture items mentioned are countable—each piece is a distinct, separate object"
          },
          {
            "sentence": "I need three pens and a notebook.",
            "analysis": "'Pens' and 'notebook' are countable—office supplies that exist as individual items"
          }
        ]
      },
      {
        "category": "Places & Buildings",
        "icon": "🏢",
        "examples": [
          {
            "sentence": "The city has five schools and two hospitals.",
            "analysis": "'City,' 'schools,' and 'hospitals' are countable—buildings and places you can count"
          },
          {
            "sentence": "We visited three museums and a castle.",
            "analysis": "'Museums' and 'castle' are countable—each represents a distinct, individual building"
          },
          {
            "sentence": "There's a park near our house.",
            "analysis": "'Park' and 'house' are countable—specific places that can be numbered and pluralized"
          },
          {
            "sentence": "The country has hundreds of islands.",
            "analysis": "'Country' and 'islands' are countable geographical entities you can enumerate"
          },
          {
            "sentence": "A hotel and three restaurants opened this year.",
            "analysis": "'Hotel' and 'restaurants' are countable buildings that can be counted individually"
          }
        ]
      },
      {
        "category": "Ideas & Abstract Countables",
        "icon": "💡",
        "examples": [
          {
            "sentence": "She has many ideas for the project.",
            "analysis": "'Ideas' are countable—even though abstract, each idea is a distinct concept you can enumerate"
          },
          {
            "sentence": "He made three mistakes on the test.",
            "analysis": "'Mistakes' are countable—you can identify and count individual errors"
          },
          {
            "sentence": "That's a good suggestion. Do you have other suggestions?",
            "analysis": "'Suggestion/suggestions' are countable—each recommendation is a separate, distinct item"
          },
          {
            "sentence": "She answered two questions correctly.",
            "analysis": "'Questions' are countable—each question is a separate, distinct inquiry"
          },
          {
            "sentence": "The teacher gave us several exercises to complete.",
            "analysis": "'Exercises' are countable tasks—each exercise is a distinct, separate activity"
          }
        ]
      }
    ]
  },
  "common_mistakes": [
    {
      "mistake_number": 1,
      "error_type": "Using Singular Countable Nouns Without Article",
      "frequency": "Very Common",
      "incorrect": "I need pen to write.",
      "correct": "I need a pen to write.",
      "explanation": "Singular countable nouns require an article (a/an/the) or determiner. You cannot use them alone in English.",
      "tip": "Always ask: Is it singular and countable? If yes, add 'a/an' or 'the'!"
    },
    {
      "mistake_number": 2,
      "error_type": "Using 'Much' with Countable Nouns",
      "frequency": "Very Common",
      "incorrect": "How much books do you have?",
      "correct": "How many books do you have?",
      "explanation": "'Much' is for uncountable nouns (much water, much time). For countable nouns, use 'many' (many books, many people).",
      "tip": "Countable = many/few. Uncountable = much/little."
    },
    {
      "mistake_number": 3,
      "error_type": "Using 'Little' with Countable Nouns",
      "frequency": "Common",
      "incorrect": "There are little students in the class.",
      "correct": "There are few students in the class.",
      "explanation": "'Little' is for uncountable nouns (little water). For countable nouns, use 'few' (few students).",
      "tip": "Remember: few = countable, little = uncountable."
    },
    {
      "mistake_number": 4,
      "error_type": "Wrong Subject-Verb Agreement",
      "frequency": "Common",
      "incorrect": "The students is studying.",
      "correct": "The students are studying.",
      "explanation": "Plural countable nouns take plural verbs. 'Students' is plural, so it needs 'are,' not 'is.'",
      "tip": "Singular noun + singular verb. Plural noun + plural verb."
    },
    {
      "mistake_number": 5,
      "error_type": "Treating Uncountable Nouns as Countable",
      "frequency": "Common",
      "incorrect": "I need an advice from you.",
      "correct": "I need some advice from you. OR I need a piece of advice from you.",
      "explanation": "'Advice' is uncountable and cannot be used with 'a/an' or pluralized. Use 'some advice' or 'a piece of advice.'",
      "tip": "Common uncountable nouns: advice, information, furniture, luggage, equipment."
    },
    {
      "mistake_number": 6,
      "error_type": "Using Wrong Article: A vs. An",
      "frequency": "Moderate",
      "incorrect": "I saw a elephant at the zoo.",
      "correct": "I saw an elephant at the zoo.",
      "explanation": "Use 'an' before vowel sounds (a, e, i, o, u). 'Elephant' starts with a vowel sound, so it needs 'an.'",
      "tip": "Listen to the sound, not just the letter: an hour (silent h), a university (y sound)."
    },
    {
      "mistake_number": 7,
      "error_type": "Forgetting Irregular Plurals",
      "frequency": "Moderate",
      "incorrect": "There are three childs in the park.",
      "correct": "There are three children in the park.",
      "explanation": "Some countable nouns have irregular plural forms. 'Child' becomes 'children,' not 'childs.'",
      "tip": "Common irregular plurals: child/children, person/people, tooth/teeth, foot/feet, mouse/mice."
    },
    {
      "mistake_number": 8,
      "error_type": "Using 'Less' Instead of 'Fewer'",
      "frequency": "Moderate",
      "incorrect": "There are less students today.",
      "correct": "There are fewer students today.",
      "explanation": "'Fewer' is for countable nouns (fewer students, fewer books). 'Less' is for uncountable nouns (less water, less time).",
      "tip": "If you can count it, use fewer. If you can't count it, use less."
    }
  ],
  "practice_exercises": {
    "identification": {
      "title": "Identify and Correct Countable Noun Usage",
      "instructions": "Identify the countable nouns and check if they're used correctly. Look for article usage, quantifiers, and verb agreement.",
      "questions": [
        {
          "id": 1,
          "sentence": "She bought three apples and two oranges from the market.",
          "answer": ["apples", "oranges", "market"],
          "explanation": "All three are countable nouns used correctly with appropriate numbers and articles."
        },
        {
          "id": 2,
          "sentence": "The library has many books but few computers.",
          "answer": ["library", "books", "computers"],
          "explanation": "All countable nouns with correct quantifiers: 'many' and 'few' are proper for countable nouns."
        },
        {
          "id": 3,
          "sentence": "A teacher and three students are in the classroom.",
          "answer": ["teacher", "students", "classroom"],
          "explanation": "Countable nouns with correct articles ('a teacher') and subject-verb agreement ('are' for plural)."
        },
        {
          "id": 4,
          "sentence": "How many chairs do we need for the party?",
          "answer": ["chairs", "party"],
          "explanation": "Both countable, correctly using 'many' (not 'much') with the plural 'chairs.'"
        },
        {
          "id": 5,
          "sentence": "I have a few ideas for the project.",
          "answer": ["ideas", "project"],
          "explanation": "Even abstract nouns like 'ideas' can be countable. 'A few' is correct for countable nouns."
        },
        {
          "id": 6,
          "sentence": "The store sells phones, tablets, and computers.",
          "answer": ["store", "phones", "tablets", "computers"],
          "explanation": "All are countable electronic items, correctly pluralized without articles (general statement)."
        },
        {
          "id": 7,
          "sentence": "She drinks two cups of coffee every morning.",
          "answer": ["cups", "coffee", "morning"],
          "explanation": "'Cups' and 'morning' are countable. 'Coffee' is uncountable, but 'cups of coffee' makes it countable."
        },
        {
          "id": 8,
          "sentence": "The children are playing with their toys in the garden.",
          "answer": ["children", "toys", "garden"],
          "explanation": "All countable nouns. Note 'children' is the irregular plural of 'child,' and verb 'are' agrees with plural."
        }
      ]
    }
  },
  "quiz_questions": {
    "easy": [
      {
        "id": 1,
        "question": "Which of the following is a countable noun?",
        "options": ["Water", "Book", "Information", "Furniture"],
        "correct_answer": 1,
        "explanation": "Book is countable (one book, two books). The others are uncountable nouns."
      },
      {
        "id": 2,
        "question": "Which sentence is correct?",
        "options": ["I need pen", "I need a pen", "I need pens many", "Pen I need"],
        "correct_answer": 1,
        "explanation": "Singular countable nouns need an article. 'I need a pen' is grammatically correct."
      },
      {
        "id": 3,
        "question": "Which quantifier is used with countable nouns?",
        "options": ["Much", "Little", "Many", "Less"],
        "correct_answer": 2,
        "explanation": "'Many' is used with countable nouns. 'Much' and 'little' are for uncountable nouns."
      },
      {
        "id": 4,
        "question": "What's the plural of 'child'?",
        "options": ["Childs", "Childes", "Children", "Childs'"],
        "correct_answer": 2,
        "explanation": "'Child' has an irregular plural: 'children,' not 'childs.'"
      },
      {
        "id": 5,
        "question": "Which is correct?",
        "options": ["A apple", "An apple", "The apples is red", "Apples is sweet"],
        "correct_answer": 1,
        "explanation": "'Apple' starts with a vowel sound, so it needs 'an,' not 'a.'"
      }
    ],
    "medium": [
      {
        "id": 1,
        "question": "Which sentence uses countable nouns correctly?",
        "options": ["I have much books", "I have many books", "I have a books", "I have books is interesting"],
        "correct_answer": 1,
        "explanation": "'Many' is correct for countable nouns. 'Much' is for uncountable nouns."
      },
      {
        "id": 2,
        "question": "In 'There are few students,' why is 'few' correct?",
        "options": ["Students is uncountable", "Few sounds better", "Students is countable, so use few (not little)", "Few is always correct"],
        "correct_answer": 2,
        "explanation": "'Students' is countable, so we use 'few.' 'Little' would be used for uncountable nouns."
      },
      {
        "id": 3,
        "question": "Which needs an article?",
        "options": ["Dogs are friendly (general)", "Dog is friendly", "The dogs are friendly (specific)", "His dog is friendly"],
        "correct_answer": 1,
        "explanation": "Singular countable nouns need an article or determiner. 'Dog is friendly' is incorrect; it should be 'A dog is friendly.'"
      },
      {
        "id": 4,
        "question": "How many countable nouns are in: 'The teacher gave advice to students'?",
        "options": ["0", "1", "2", "3"],
        "correct_answer": 2,
        "explanation": "Two: 'teacher' and 'students.' 'Advice' is uncountable."
      },
      {
        "id": 5,
        "question": "Which is the correct usage?",
        "options": ["Fewer people", "Less people", "Little people", "Much people"],
        "correct_answer": 0,
        "explanation": "'Fewer' is for countable nouns like 'people.' 'Less' is for uncountable nouns."
      }
    ],
    "hard": [
      {
        "id": 1,
        "question": "In 'She has three pieces of furniture,' why is 'furniture' uncountable but we can count it?",
        "options": ["Furniture is actually countable", "We count 'pieces,' not furniture itself", "It's a grammar exception", "Furniture can be both"],
        "correct_answer": 1,
        "explanation": "Furniture is uncountable, but we can count 'pieces of furniture.' The countable noun is 'pieces,' not 'furniture.'"
      },
      {
        "id": 2,
        "question": "Which sentence demonstrates correct understanding of countable nouns?",
        "options": ["I have much friends", "I have many friend", "I have many friends", "I have friend"],
        "correct_answer": 2,
        "explanation": "'Friends' is plural countable, requiring 'many' (not 'much'), and no article is needed for plural general statements."
      },
      {
        "id": 3,
        "question": "Why is 'information' uncountable but 'idea' is countable?",
        "options": ["Information is newer word", "Ideas are concrete, information is abstract", "Information is continuous, ideas are discrete units", "No logical reason"],
        "correct_answer": 2,
        "explanation": "Information is viewed as a continuous mass (like water), while ideas are seen as separate, distinct units you can count."
      },
      {
        "id": 4,
        "question": "In 'The cattle are grazing,' why is the verb plural?",
        "options": ["Cattle is always plural", "Cattle is a collective noun that takes plural verb", "It's a mistake—should be 'is'", "British English only"],
        "correct_answer": 1,
        "explanation": "'Cattle' is a collective countable noun that always takes a plural verb, even though it doesn't end in -s."
      },
      {
        "id": 5,
        "question": "Which explains 'two coffees' in a café context?",
        "options": ["Coffee is countable in cafés", "'Coffees' means cups of coffee (containers are countable)", "It's slang", "Coffee becomes countable when hot"],
        "correct_answer": 1,
        "explanation": "'Two coffees' is short for 'two cups of coffee.' The container (cup/glass) makes uncountable substances countable."
      }
    ]
  },
  "additional_resources": [
    {
      "type": "Interactive Game",
      "title": "Countable vs Uncountable Noun Sorter",
      "description": "Drag-and-drop game to practice identifying countable and uncountable nouns with instant feedback",
      "url": "Grammar learning platforms"
    },
    {
      "type": "Printable Chart",
      "title": "Complete List of Countable Nouns with Plurals",
      "description": "Downloadable reference chart showing regular and irregular plural forms",
      "url": "Educational resource websites"
    },
    {
      "type": "Mobile App",
      "title": "English Grammar: Nouns Master",
      "description": "Comprehensive app for practicing countable nouns with quizzes and progress tracking",
      "url": "Available on app stores"
    },
    {
      "type": "Online Exercise",
      "title": "Articles with Countable Nouns Practice",
      "description": "100+ interactive exercises focusing on a/an/the usage with countable nouns",
      "url": "Grammar practice websites"
    },
    {
      "type": "Video Course",
      "title": "Master English Articles and Countable Nouns",
      "description": "Complete video course covering all aspects of countable noun usage",
      "url": "Online learning platforms"
    }
  ],
  "fun_facts": [
    {
      "fact": "The word 'pants' is always plural in English, even when referring to one item! You say 'these pants are' not 'this pant is.'",
      "icon": "👖"
    },
    {
      "fact": "Some nouns are countable in one language but uncountable in English! In French, 'furniture' is countable (un meuble, des meubles), but in English it's always uncountable.",
      "icon": "🌍"
    },
    {
      "fact": "'Fish' can be both singular and plural! One fish, two fish. But if you're talking about different species, you can say 'fishes.'",
      "icon": "🐠"
    },
    {
      "fact": "English has about 100 irregular plural forms (child/children, mouse/mice), but there are over 50,000 regular countable nouns that just add -s!",
      "icon": "📚"
    },
    {
      "fact": "The word 'agenda' was originally a plural form in Latin! Now in English, it's singular (this agenda), and we can say 'agendas' for the plural.",
      "icon": "📋"
    },
    {
      "fact": "Native English speakers typically know 20,000-35,000 countable nouns by adulthood—that's identifying and counting tens of thousands of distinct things!",
      "icon": "🧠"
    }
  ]
};

async function seedCountableNouns() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    const typeId = 253; // Countable Nouns
    
    console.log(`🔄 Updating Countable Nouns (ID: ${typeId})...`);
    
    const [result] = await sequelize.query(`
      UPDATE grammar_types 
      SET learn_more_content = :content
      WHERE id = :id
      RETURNING id, name
    `, {
      replacements: {
        id: typeId,
        content: JSON.stringify(countableNounsData)
      }
    });

    if (result.length > 0) {
      console.log(`✅ Successfully updated: ${result[0].name} (ID: ${result[0].id})`);
      console.log(`📊 Sections added: ${Object.keys(countableNounsData).length}`);
      console.log(`   - Overview with ${countableNounsData.overview.key_points.length} key points`);
      console.log(`   - ${countableNounsData.detailed_explanation.sections.length} detailed sections`);
      console.log(`   - ${countableNounsData.video_resources.length} video resources`);
      console.log(`   - ${countableNounsData.grammar_rules.rules.length} grammar rules`);
      console.log(`   - ${countableNounsData.examples.categories.length} example categories`);
      console.log(`   - ${countableNounsData.common_mistakes.length} common mistakes`);
      console.log(`   - ${countableNounsData.practice_exercises.identification.questions.length} practice questions`);
      console.log(`   - Quiz: ${countableNounsData.quiz_questions.easy.length} easy, ${countableNounsData.quiz_questions.medium.length} medium, ${countableNounsData.quiz_questions.hard.length} hard`);
      console.log(`   - ${countableNounsData.additional_resources.length} additional resources`);
      console.log(`   - ${countableNounsData.fun_facts.length} fun facts`);
    } else {
      console.log('❌ No record found with that ID');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

seedCountableNouns();
