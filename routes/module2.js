const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'english_portal',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASS || 'mayu'
});

// GET /api/module2/lessons - fetch from database
router.get('/lessons', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, slug, title, skill_area, level, description, published FROM lessons WHERE published = true ORDER BY skill_area'
    );
    const lessons = result.rows.map(row => ({
      slug: row.slug,
      title: row.title,
      excerpt: row.description || 'No description available'
    }));
    res.json({ lessons });
  } catch (err) {
    console.error('Error fetching lessons:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// GET /api/module2/lessons/:slug - fetch lesson and sections from database
router.get('/lessons/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    
    // Get lesson
    const lessonResult = await pool.query(
      'SELECT * FROM lessons WHERE slug = $1',
      [slug]
    );
    
    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    const lesson = lessonResult.rows[0];
    
    // Get sections
    const sectionsResult = await pool.query(
      'SELECT * FROM lesson_sections WHERE lesson_id = $1 ORDER BY order_index',
      [lesson.id]
    );
    
    res.json({
      slug: lesson.slug,
      title: lesson.title,
      content: sectionsResult.rows[0]?.content || '',
      sections: sectionsResult.rows
    });
  } catch (err) {
    console.error('Error fetching lesson:', err);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// GET /api/module2/quizzes?lesson=slug
router.get('/quizzes', (req, res) => {
  const lesson = req.query.lesson || null;
  
  // Listening Quiz - Audio-based comprehension
  const listeningQuiz = {
    quiz_id: 'listening-audio-comprehension',
    lesson_id: 'listening',
    quiz_type: 'audio',
    instructions: 'Listen to the audio clip and answer the questions. You can play it multiple times.',
    questions: [
      {
        id: 'q1',
        question: 'Listen to the conversation. Where are the speakers?',
        audioUrl: '/audio/listening/conversation1.mp3',
        audioText: 'Audio: "Excuse me, do you have this shirt in size medium?" "Yes, let me check the stockroom for you."',
        options: ['At a restaurant', 'At a clothing store', 'At a library', 'At a bus stop'],
        answer: 1,
        explanation: 'The conversation about shirts and sizes indicates they are in a clothing store.'
      },
      {
        id: 'q2',
        question: 'What does the customer want?',
        audioUrl: '/audio/listening/conversation1.mp3',
        audioText: 'Audio: Same as above',
        options: ['A different color', 'A different size', 'A refund', 'Directions'],
        answer: 1,
        explanation: 'The customer asks for "size medium", so they want a different size.'
      },
      {
        id: 'q3',
        question: 'Listen to the weather report. What will the temperature be tomorrow?',
        audioUrl: '/audio/listening/weather.mp3',
        audioText: 'Audio: "Good evening. Tomorrow we can expect sunny skies with a high of 25 degrees Celsius and a low of 18 degrees."',
        options: ['15°C', '18°C', '25°C', '30°C'],
        answer: 2,
        explanation: 'The report says "a high of 25 degrees Celsius".'
      },
      {
        id: 'q4',
        question: 'What is the weather like tomorrow?',
        audioUrl: '/audio/listening/weather.mp3',
        audioText: 'Audio: Same as above',
        options: ['Rainy', 'Cloudy', 'Sunny', 'Snowy'],
        answer: 2,
        explanation: 'The weather report mentions "sunny skies".'
      },
      {
        id: 'q5',
        question: 'Listen to the announcement. What time does the train depart?',
        audioUrl: '/audio/listening/train.mp3',
        audioText: 'Audio: "Attention passengers. The train to London will depart from platform 3 at 2:45 PM."',
        options: ['2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM'],
        answer: 2,
        explanation: 'The announcement clearly states "2:45 PM".'
      }
    ]
  };

  // Speaking Quiz - Pronunciation and dialogue practice
  const speakingQuiz = {
    quiz_id: 'speaking-pronunciation',
    lesson_id: 'speaking',
    quiz_type: 'speaking',
    instructions: 'Read each sentence aloud. Focus on pronunciation, intonation, and fluency. Record yourself if possible.',
    questions: [
      {
        id: 'q1',
        question: 'Practice this greeting. Which is the most appropriate response?',
        prompt: 'Someone says: "How are you today?"',
        options: ['I\'m fine, thank you. How about you?', 'Yes, I am.', 'No problem.', 'Thank you very much.'],
        answer: 0,
        explanation: 'The natural response to "How are you?" is "I\'m fine, thank you" followed by asking back.',
        pronunciation: '/haʊ ɑːr juː təˈdeɪ/',
        tips: 'Stress "HOW" and "YOU". Use rising intonation at the end when asking back.'
      },
      {
        id: 'q2',
        question: 'Choose the correct pronunciation stress for: "photograph"',
        options: ['PHO-to-graph', 'pho-TO-graph', 'pho-to-GRAPH', 'All equal stress'],
        answer: 0,
        explanation: 'Stress falls on the first syllable: PHO-to-graph (/ˈfoʊtəɡræf/).',
        pronunciation: '/ˈfoʊtəɡræf/',
        tips: 'First syllable stress is common in many English nouns.'
      },
      {
        id: 'q3',
        question: 'Which response is most polite for declining an invitation?',
        prompt: 'Someone says: "Would you like to join us for dinner?"',
        options: ['No.', 'I can\'t.', 'I\'d love to, but I have other plans. Thank you for asking!', 'Maybe.'],
        answer: 2,
        explanation: 'The polite way includes appreciation and a gentle reason.',
        tips: 'Use "I\'d love to, but..." to sound friendly and polite when declining.'
      },
      {
        id: 'q4',
        question: 'Practice word linking. How do you say: "Can I have an apple?"',
        options: ['Can-I-have-an-apple (separate)', 'Ca-nI-ha-vea-napple (linked)', 'Can I / have an / apple (paused)', 'All are equally correct'],
        answer: 1,
        explanation: 'Native speakers link words together: "Ca-nI ha-vea napple" for natural flow.',
        pronunciation: '/kən aɪ hæv ən ˈæpəl/',
        tips: 'Link "can I", "have an" together. "An apple" sounds like "a napple".'
      },
      {
        id: 'q5',
        question: 'Which intonation pattern is correct for: "You\'re coming to the party?"',
        options: ['Falling intonation ↘', 'Rising intonation ↗', 'Flat tone →', 'Doesn\'t matter'],
        answer: 1,
        explanation: 'Yes/no questions use rising intonation at the end.',
        tips: 'Your voice should go UP at the end when asking yes/no questions.'
      }
    ]
  };

  // Reading Quiz - Passage comprehension
  const readingQuiz = {
    quiz_id: 'reading-comprehension',
    lesson_id: 'reading',
    quiz_type: 'reading',
    instructions: 'Read the passage carefully and answer the questions.',
    passage: `The Amazon Rainforest is the world's largest tropical rainforest. It covers approximately 5.5 million square kilometers and spans across nine countries in South America, with the majority located in Brazil. 

The Amazon is home to an incredible diversity of life. Scientists estimate that the region contains about 10% of all species on Earth, including over 40,000 plant species, 1,300 bird species, and 2.5 million insect species.

The rainforest plays a crucial role in regulating the Earth's climate. Its trees absorb massive amounts of carbon dioxide and produce about 20% of the world's oxygen, earning it the nickname "the lungs of the Earth."

However, the Amazon faces serious threats from deforestation, mainly due to logging, agriculture, and cattle ranching. Between 2000 and 2020, approximately 10% of the Amazon was lost to deforestation. Conservation efforts are critical to protect this vital ecosystem for future generations.`,
    questions: [
      {
        id: 'q1',
        question: 'How large is the Amazon Rainforest?',
        options: ['3.5 million km²', '5.5 million km²', '7.5 million km²', '10 million km²'],
        answer: 1,
        explanation: 'The passage states it covers "approximately 5.5 million square kilometers".'
      },
      {
        id: 'q2',
        question: 'What percentage of Earth\'s species are found in the Amazon?',
        options: ['5%', '10%', '20%', '30%'],
        answer: 1,
        explanation: 'The text says "about 10% of all species on Earth".'
      },
      {
        id: 'q3',
        question: 'Why is the Amazon called "the lungs of the Earth"?',
        options: ['It has many hospitals', 'It produces about 20% of the world\'s oxygen', 'It has clean air', 'It is shaped like lungs'],
        answer: 1,
        explanation: 'The passage explains it "produce[s] about 20% of the world\'s oxygen".'
      },
      {
        id: 'q4',
        question: 'What is the main cause of deforestation in the Amazon?',
        options: ['Natural disasters', 'Climate change', 'Logging, agriculture, and cattle ranching', 'Urban development'],
        answer: 2,
        explanation: 'The text lists "logging, agriculture, and cattle ranching" as main causes.'
      },
      {
        id: 'q5',
        question: 'How much of the Amazon was lost between 2000 and 2020?',
        options: ['5%', '10%', '15%', '20%'],
        answer: 1,
        explanation: 'The passage states "approximately 10% of the Amazon was lost".'
      }
    ]
  };

  // Writing Quiz - Sentence construction and error correction
  const writingQuiz = {
    quiz_id: 'writing-grammar-construction',
    lesson_id: 'writing',
    quiz_type: 'writing',
    instructions: 'Test your writing skills by identifying errors and constructing proper sentences.',
    questions: [
      {
        id: 'q1',
        question: 'Which sentence is grammatically correct?',
        options: [
          'Me and my friend went to the movies.',
          'My friend and I went to the movies.',
          'My friend and me went to the movies.',
          'I and my friend went to the movies.'
        ],
        answer: 1,
        explanation: 'Use "My friend and I" (subject pronouns). Put yourself last as a courtesy.'
      },
      {
        id: 'q2',
        question: 'Identify the error: "She don\'t like coffee."',
        options: ['No error', 'Should be "doesn\'t"', 'Should be "didn\'t"', 'Should be "won\'t"'],
        answer: 1,
        explanation: 'Third person singular requires "doesn\'t" not "don\'t". Correct: "She doesn\'t like coffee."'
      },
      {
        id: 'q3',
        question: 'Choose the best way to combine: "I was tired. I went to bed early."',
        options: [
          'I was tired I went to bed early.',
          'I was tired, I went to bed early.',
          'I was tired, so I went to bed early.',
          'I was tired and I went to bed early.'
        ],
        answer: 2,
        explanation: 'Use a comma + coordinating conjunction (so) to show cause and effect between independent clauses.'
      },
      {
        id: 'q4',
        question: 'Fix the run-on sentence: "I love reading books they take me to different worlds."',
        options: [
          'I love reading books, they take me to different worlds.',
          'I love reading books because they take me to different worlds.',
          'I love reading books they take me to different worlds.',
          'I love reading books and they take me to different worlds.'
        ],
        answer: 1,
        explanation: 'Use a subordinating conjunction (because) to properly connect the clauses and show relationship.'
      },
      {
        id: 'q5',
        question: 'Which sentence has correct punctuation?',
        options: [
          'My favorite foods are: pizza pasta and salad.',
          'My favorite foods are pizza, pasta, and salad.',
          'My favorite foods are, pizza, pasta and salad.',
          'My favorite foods are pizza pasta, and salad.'
        ],
        answer: 1,
        explanation: 'Use commas to separate items in a list. The Oxford comma (before "and") is recommended.'
      },
      {
        id: 'q6',
        question: 'Choose the sentence with parallel structure:',
        options: [
          'I like swimming, to bike, and running.',
          'I like swimming, biking, and running.',
          'I like to swim, biking, and to run.',
          'I like swim, bike, and run.'
        ],
        answer: 1,
        explanation: 'Parallel structure uses the same grammatical form: all gerunds (swimming, biking, running).'
      },
      {
        id: 'q7',
        question: 'Identify the fragment: "Because I was late."',
        options: [
          'Complete sentence',
          'Sentence fragment - needs independent clause',
          'Run-on sentence',
          'Correct as is'
        ],
        answer: 1,
        explanation: 'This is a dependent clause and cannot stand alone. It needs an independent clause: "Because I was late, I missed the bus."'
      }
    ]
  };

  // Grammar quizzes
  const grammarQuiz = {
    quiz_id: 'grammar-comprehensive',
    lesson_id: 'grammar',
    quiz_type: 'mcq',
    questions: [
      {
        id: 'q1',
        question: 'Choose the correct present simple form: "She ___ to school every day."',
        options: ['go', 'goes', 'going', 'gone'],
        answer: 1,
        explanation: 'Use "goes" for third person singular (he/she/it) in present simple.'
      },
      {
        id: 'q2',
        question: 'Which sentence is in the past continuous tense?',
        options: ['I study English', 'I studied English', 'I was studying English', 'I have studied English'],
        answer: 2,
        explanation: 'Past continuous uses "was/were + verb+ing" to show an action in progress in the past.'
      },
      {
        id: 'q3',
        question: 'Identify the noun in this sentence: "The happy children played in the park."',
        options: ['happy', 'children', 'played', 'in'],
        answer: 1,
        explanation: '"Children" is a noun (a person, place, or thing). "Happy" is an adjective, "played" is a verb.'
      },
      {
        id: 'q4',
        question: 'Choose the correct article: "___ elephant is a large animal."',
        options: ['A', 'An', 'The', 'No article'],
        answer: 1,
        explanation: 'Use "An" before words starting with vowel sounds. "Elephant" starts with /e/ sound.'
      },
      {
        id: 'q5',
        question: 'Which word is an adverb? "She speaks English ___."',
        options: ['fluent', 'fluently', 'fluency', 'fluence'],
        answer: 1,
        explanation: '"Fluently" is an adverb (tells us HOW she speaks). Adverbs often end in -ly.'
      },
      {
        id: 'q6',
        question: 'Select the correct preposition: "I will meet you ___ 5 o\'clock."',
        options: ['in', 'on', 'at', 'by'],
        answer: 2,
        explanation: 'Use "at" with specific times (at 5 o\'clock, at noon, at midnight).'
      },
      {
        id: 'q7',
        question: 'Which is the correct passive voice? "John writes the letter."',
        options: ['The letter writes by John', 'The letter is written by John', 'The letter written by John', 'The letter was writing by John'],
        answer: 1,
        explanation: 'Passive voice structure: subject + be + past participle + by + agent.'
      },
      {
        id: 'q8',
        question: 'Choose the correct pronoun: "Sarah and ___ went to the mall."',
        options: ['me', 'I', 'myself', 'mine'],
        answer: 1,
        explanation: 'Use "I" as a subject pronoun. "Sarah and I" is the subject of the sentence.'
      },
      {
        id: 'q9',
        question: 'Identify the conjunction: "I like tea but I don\'t like coffee."',
        options: ['like', 'but', 'don\'t', 'tea'],
        answer: 1,
        explanation: '"But" is a conjunction that joins two contrasting ideas.'
      },
      {
        id: 'q10',
        question: 'Which is the correct present perfect form?',
        options: ['I live here for 5 years', 'I am living here for 5 years', 'I have lived here for 5 years', 'I lived here for 5 years'],
        answer: 2,
        explanation: 'Use present perfect (have/has + past participle) for actions that started in the past and continue to present.'
      },
      {
        id: 'q11',
        question: 'Choose the correct form: "If I ___ rich, I would travel the world."',
        options: ['am', 'was', 'were', 'will be'],
        answer: 2,
        explanation: 'Second conditional (unreal present) uses "if + past tense" (were is preferred for all subjects).'
      },
      {
        id: 'q12',
        question: 'Select the correct word: "___ coming to the party tonight?"',
        options: ['Your', 'You\'re', 'Yore', 'Youre'],
        answer: 1,
        explanation: '"You\'re" is the contraction of "you are". "Your" shows possession.'
      },
      {
        id: 'q13',
        question: 'Which sentence has correct subject-verb agreement?',
        options: ['Everyone are happy', 'Everyone is happy', 'Everyone be happy', 'Everyone were happy'],
        answer: 1,
        explanation: '"Everyone" is singular and takes a singular verb (is, was, has).'
      },
      {
        id: 'q14',
        question: 'Choose the correct comparative form: "This book is ___ than that one."',
        options: ['good', 'better', 'best', 'more good'],
        answer: 1,
        explanation: '"Better" is the irregular comparative form of "good". Never use "more good".'
      },
      {
        id: 'q15',
        question: 'Identify the determiner: "___ students are studying in the library."',
        options: ['The', 'are', 'studying', 'library'],
        answer: 0,
        explanation: '"The" is a determiner (definite article) that specifies which students.'
      }
    ]
  };

  // Vocabulary quiz
  const vocabularyQuiz = {
    quiz_id: 'vocabulary-phrasal-verbs',
    lesson_id: 'vocabulary',
    quiz_type: 'mcq',
    questions: [
      {
        id: 'q1',
        question: 'What does "give up" mean?',
        options: ['To start something', 'To stop trying', 'To continue', 'To improve'],
        answer: 1,
        explanation: '"Give up" means to stop trying or quit something.'
      },
      {
        id: 'q2',
        question: '"Look after" means:',
        options: ['To search for', 'To take care of', 'To ignore', 'To remember'],
        answer: 1,
        explanation: '"Look after" means to take care of someone or something.'
      },
      {
        id: 'q3',
        question: 'Choose the correct meaning of "put off":',
        options: ['To wear something', 'To delay or postpone', 'To remove', 'To turn on'],
        answer: 1,
        explanation: '"Put off" means to delay or postpone something to a later time.'
      }
    ]
  };

  // Pronunciation Quiz (can be included with vocabulary)
  const pronunciationQuiz = {
    quiz_id: 'pronunciation-sounds',
    lesson_id: 'pronunciation',
    quiz_type: 'speaking',
    instructions: 'Practice these pronunciation patterns. Focus on the sounds and stress.',
    questions: [
      {
        id: 'q1',
        question: 'Which word has a different vowel sound?',
        options: ['cat', 'bat', 'hate', 'mat'],
        answer: 2,
        explanation: '"Hate" has a long /eɪ/ sound, while others have short /æ/ sound.',
        pronunciation: 'cat /kæt/, hate /heɪt/'
      },
      {
        id: 'q2',
        question: 'Where is the stress in "photographer"?',
        options: ['PHO-to-gra-pher', 'pho-TO-gra-pher', 'pho-to-GRA-pher', 'pho-to-gra-PHER'],
        answer: 1,
        explanation: 'Stress falls on the second syllable: pho-TO-gra-pher /fəˈtɑːɡrəfər/.'
      },
      {
        id: 'q3',
        question: 'Which pair rhymes?',
        options: ['cough / tough', 'through / though', 'food / good', 'taught / thought'],
        answer: 3,
        explanation: '"Taught" and "thought" both have the /ɔːt/ sound and rhyme perfectly.'
      }
    ]
  };

  // Return quiz based on lesson
  const quizzes = {
    'listening': listeningQuiz,
    'speaking': speakingQuiz,
    'reading': readingQuiz,
    'writing': writingQuiz,
    'grammar': grammarQuiz,
    'vocabulary': vocabularyQuiz,
    'pronunciation': pronunciationQuiz
  };

  const quiz = quizzes[lesson] || grammarQuiz;
  res.json({ quizzes: [quiz] });
});

// S3 upload stub endpoint note (actual S3 implementation required keys/credentials)
router.post('/media/upload-url', (req, res) => {
  res.json({
    message: 'S3 upload URL generation not implemented in scaffold. Use AWS SDK or presigned URLs in production.'
  });
});

module.exports = router;
