require('dotenv').config();
const {
  PartOfSpeech,
  GrammarType,
  GrammarRule,
  GrammarExample,
  GrammarExercise,
  GrammarQuizQuestion,
  GrammarResource
} = require('./models/grammar');
const { sequelize } = require('./models/grammar');

const partsOfSpeechData = [
  {
    name: 'Noun',
    icon: '📦',
    definition: 'Words that name people, places, things, or ideas.',
    importance: 'Nouns form the foundation of sentences. Every sentence needs at least one noun (the subject). They tell us what or who the sentence is about.'
  },
  {
    name: 'Pronoun',
    icon: '🔄',
    definition: 'Words that replace nouns to avoid repetition.',
    importance: 'Pronouns create fluency and reduce redundancy. They must agree in number and gender with their antecedents.'
  },
  {
    name: 'Verb',
    icon: '🔤',
    definition: 'Words that express action, occurrence, or a state of being.',
    importance: 'Verbs control tense, meaning, and sentence flow. They are essential to predicate and convey what happens or is.'
  },
  {
    name: 'Adjective',
    icon: '🎨',
    definition: 'Words that describe or modify nouns.',
    importance: 'Adjectives add detail and clarity to nouns. They help listeners/readers visualize and understand better.'
  },
  {
    name: 'Adverb',
    icon: '⚡',
    definition: 'Words that modify verbs, adjectives, or other adverbs.',
    importance: 'Adverbs show how, when, where, or why something happens. They provide context and detail to actions and descriptions.'
  },
  {
    name: 'Preposition',
    icon: '📍',
    definition: 'Words that show relationships between nouns/pronouns and other words.',
    importance: 'Prepositions show location, direction, time, and relationships. They connect ideas and clarify spatial/temporal context.'
  },
  {
    name: 'Conjunction',
    icon: '🔗',
    definition: 'Words that connect words, phrases, or clauses.',
    importance: 'Conjunctions link ideas logically. They show relationships between independent/dependent clauses and create complex thoughts.'
  },
  {
    name: 'Interjection',
    icon: '💬',
    definition: 'Words or phrases that express emotion or surprise.',
    importance: 'Interjections add emotion and realism to dialogue. They show feelings like excitement, surprise, or pain.'
  }
];

const typesData = {
  Noun: [
    { name: 'Common Nouns', description: 'General names for any person, place, or thing.', icon: '🏠', examples: ['dog', 'city', 'table'], sampleWords: ['cat', 'school', 'book'], color: 'blue' },
    { name: 'Proper Nouns', description: 'Specific names for particular people, places, or things; always capitalized.', icon: '🏢', examples: ['John', 'Paris', 'Google'], sampleWords: ['Sarah', 'London', 'Apple'], color: 'purple' },
    { name: 'Abstract Nouns', description: 'Names of ideas, emotions, or qualities that cannot be touched.', icon: '💭', examples: ['love', 'freedom', 'justice'], sampleWords: ['happiness', 'courage', 'peace'], color: 'pink' },
    { name: 'Collective Nouns', description: 'Names for groups of people or things.', icon: '👥', examples: ['team', 'flock', 'jury'], sampleWords: ['herd', 'class', 'audience'], color: 'green' }
  ],
  Pronoun: [
    { name: 'Personal Pronouns', description: 'Refer to specific people or things (I, you, he, she, it, we, they).', icon: '👤', examples: ['I walked', 'She runs'], sampleWords: ['I', 'you', 'he', 'she'], color: 'blue' },
    { name: 'Possessive Pronouns', description: 'Show ownership (mine, yours, his, hers, its, ours, theirs).', icon: '🎁', examples: ['This book is mine', 'That pen is hers'], sampleWords: ['mine', 'yours', 'his'], color: 'orange' },
    { name: 'Reflexive Pronouns', description: 'Refer back to the subject (myself, yourself, himself, herself, itself, ourselves, themselves).', icon: '🪞', examples: ['She taught herself', 'I hurt myself'], sampleWords: ['myself', 'yourself', 'himself'], color: 'red' },
    { name: 'Relative Pronouns', description: 'Connect clauses (who, whom, whose, which, that).', icon: '🔗', examples: ['The girl who runs fast', 'The book which I read'], sampleWords: ['who', 'which', 'that'], color: 'green' }
  ],
  Verb: [
    { name: 'Action Verbs', description: 'Show physical or mental actions.', icon: '💪', examples: ['run', 'think', 'write'], sampleWords: ['jump', 'create', 'solve'], color: 'red' },
    { name: 'Linking Verbs', description: 'Connect subject to a description (be, seem, appear, become).', icon: '🔗', examples: ['She is happy', 'It seems difficult'], sampleWords: ['am', 'are', 'is'], color: 'blue' },
    { name: 'Modal Verbs', description: 'Show ability, possibility, or obligation (can, could, may, might, must, should, will, would).', icon: '⚡', examples: ['I can swim', 'You must study'], sampleWords: ['can', 'could', 'must'], color: 'purple' },
    { name: 'Phrasal Verbs', description: 'Verb + particle combinations with special meanings.', icon: '🎯', examples: ['Give up', 'Look after'], sampleWords: ['put off', 'turn on', 'break down'], color: 'orange' }
  ],
  Adjective: [
    { name: 'Descriptive Adjectives', description: 'Describe qualities of nouns.', icon: '🎨', examples: ['big', 'beautiful', 'sad'], sampleWords: ['tall', 'bright', 'cold'], color: 'pink' },
    { name: 'Quantitative Adjectives', description: 'Describe amount or quantity.', icon: '📊', examples: ['some', 'few', 'many'], sampleWords: ['several', 'all', 'none'], color: 'orange' },
    { name: 'Demonstrative Adjectives', description: 'Point to specific nouns (this, that, these, those).', icon: '👉', examples: ['This book', 'Those houses'], sampleWords: ['this', 'that', 'these'], color: 'yellow' },
    { name: 'Comparative & Superlative', description: 'Compare nouns (bigger, biggest; more beautiful, most beautiful).', icon: '⚖️', examples: ['taller than', 'the tallest'], sampleWords: ['smaller', 'highest', 'better'], color: 'teal' }
  ],
  Adverb: [
    { name: 'Adverbs of Manner', description: 'Describe how an action is performed (usually -ly).', icon: '🚀', examples: ['quickly', 'carefully', 'slowly'], sampleWords: ['happily', 'loudly', 'softly'], color: 'blue' },
    { name: 'Adverbs of Time', description: 'Describe when something happens.', icon: '⏰', examples: ['yesterday', 'tomorrow', 'now'], sampleWords: ['soon', 'today', 'finally'], color: 'green' },
    { name: 'Adverbs of Place', description: 'Describe where something happens.', icon: '📍', examples: ['here', 'there', 'everywhere'], sampleWords: ['inside', 'outside', 'nearby'], color: 'purple' },
    { name: 'Adverbs of Frequency', description: 'Describe how often something happens.', icon: '🔁', examples: ['always', 'never', 'sometimes'], sampleWords: ['usually', 'rarely', 'often'], color: 'orange' }
  ],
  Preposition: [
    { name: 'Prepositions of Place', description: 'Show location or position.', icon: '📍', examples: ['in', 'on', 'under'], sampleWords: ['inside', 'above', 'behind'], color: 'blue' },
    { name: 'Prepositions of Time', description: 'Show when something happens.', icon: '⏳', examples: ['at', 'during', 'after'], sampleWords: ['before', 'since', 'until'], color: 'green' },
    { name: 'Prepositions of Direction', description: 'Show movement or direction.', icon: '➡️', examples: ['to', 'from', 'toward'], sampleWords: ['into', 'out of', 'across'], color: 'orange' },
    { name: 'Prepositions of Relationship', description: 'Show relationships between words.', icon: '🔗', examples: ['with', 'about', 'for'], sampleWords: ['by', 'of', 'to'], color: 'purple' }
  ],
  Conjunction: [
    { name: 'Coordinating Conjunctions', description: 'Connect equal ideas (and, but, or, nor, for, yet, so).', icon: '➕', examples: ['He is smart and hardworking', 'I like tea or coffee'], sampleWords: ['and', 'but', 'or'], color: 'red' },
    { name: 'Subordinating Conjunctions', description: 'Connect dependent clauses (because, although, if, while, since).', icon: '🔽', examples: ['I study because I want to succeed', 'Although it rained, we played'], sampleWords: ['because', 'if', 'while'], color: 'blue' },
    { name: 'Correlative Conjunctions', description: 'Work in pairs (either...or, both...and, neither...nor).', icon: '👯', examples: ['Either you come or I go', 'Both Sarah and John are here'], sampleWords: ['both...and', 'either...or'], color: 'green' }
  ],
  Interjection: [
    { name: 'Mild Interjections', description: 'Express mild emotion or surprise.', icon: '🤔', examples: ['oh', 'ah', 'well'], sampleWords: ['hmm', 'um', 'uh'], color: 'blue' },
    { name: 'Strong Interjections', description: 'Express strong emotion or surprise.', icon: '😲', examples: ['Wow!', 'Amazing!', 'Fantastic!'], sampleWords: ['Excellent!', 'Incredible!', 'Wonderful!'], color: 'red' },
    { name: 'Pain/Attention Interjections', description: 'Express pain, attention, or pain-related emotions.', icon: '⚠️', examples: ['Ouch!', 'Hey!', 'Psst!'], sampleWords: ['Ow!', 'Listen!', 'Watch!'], color: 'orange' }
  ]
};

const rulesData = {
  Noun: [
    { rule_type: 'do', title: 'DO', points: ['Capitalize proper nouns (London, Mary, January)', 'Use singular nouns with singular verbs and plural with plural (The cat is sleeping; The cats are sleeping)', 'Choose concrete nouns when possible for clarity'], color: 'green', icon: '✅' },
    { rule_type: 'dont', title: "DON'T", points: ['Don\'t use article "a" before vowel sounds (a hour is wrong; an hour is right)', 'Don\'t mix singular and plural in the same sentence without reason', 'Don\'t forget countable vs uncountable nouns (many apples, but much rice)'], color: 'red', icon: '❌' }
  ],
  Pronoun: [
    { rule_type: 'do', title: 'DO', points: ['Make pronouns agree with their antecedent in number (Mary loves her job, not "Mary loves his job")', 'Use "I" and "me" correctly (I went vs. He gave it to me)', 'Use reflexive pronouns only when the subject and object are the same person'], color: 'green', icon: '✅' },
    { rule_type: 'dont', title: "DON'T", points: ['Don\'t use pronouns without a clear antecedent', 'Don\'t mix "who" and "whom" (who = subject, whom = object)', 'Don\'t use the same pronoun for two different nouns in one sentence'], color: 'red', icon: '❌' }
  ],
  Verb: [
    { rule_type: 'do', title: 'DO', points: ['Match verb tense to your time reference (past events = past tense)', 'Use consistent tense throughout your writing', 'Learn common irregular verbs (go-went-gone, eat-ate-eaten)'], color: 'green', icon: '✅' },
    { rule_type: 'dont', title: "DON'T", points: ['Don\'t mix tenses in the same paragraph unless there\'s a time shift', 'Don\'t use wrong gerund/infinitive after verbs (enjoy reading, not enjoy to read)', 'Don\'t forget that modal verbs don\'t take -s in third person (He can go, not He cans go)'], color: 'red', icon: '❌' }
  ],
  Adjective: [
    { rule_type: 'do', title: 'DO', points: ['Place adjectives before the noun in English (big house, not house big)', 'Use multiple adjectives in a logical order (opinion, size, age, color, origin)', 'Add -er and -est to short adjectives (big, bigger, biggest)'], color: 'green', icon: '✅' },
    { rule_type: 'dont', title: "DON'T", points: ['Don\'t add -ly to adjectives; that makes them adverbs', 'Don\'t use double comparatives (more bigger is wrong; use bigger or more beautiful)', 'Don\'t forget that some adjectives are irregular (good, better, best)'], color: 'red', icon: '❌' }
  ],
  Adverb: [
    { rule_type: 'do', title: 'DO', points: ['Create adverbs by adding -ly to adjectives (quick → quickly)', 'Place adverbs strategically: manner adverbs near the verb, frequency adverbs before main verbs', 'Use "well" for actions, "good" only as an adjective'], color: 'green', icon: '✅' },
    { rule_type: 'dont', title: "DON'T", points: ['Don\'t confuse adverbs with adjectives (She speaks clear is wrong; She speaks clearly is right)', 'Don\'t place negative adverbs at the end of sentences (Never use double negatives)', 'Don\'t forget that some adverbs don\'t end in -ly (fast, hard, well)'], color: 'red', icon: '❌' }
  ],
  Preposition: [
    { rule_type: 'do', title: 'DO', points: ['Learn prepositions as phrases (in the morning, at the store, on time)', 'Use correct prepositions for time (at 3pm, on Monday, in July)', 'Remember "to" for direction and infinitives (go to school, want to learn)'], color: 'green', icon: '✅' },
    { rule_type: 'dont', title: "DON'T", points: ['Don\'t end sentences with prepositions in formal writing (Whom are you talking about? not Who are you talking about?)', 'Don\'t use prepositions before gerunds unnecessarily (She is good at singing, not at to sing)', 'Don\'t confuse "in/on" (in the room vs. on the desk) — spatial context matters'], color: 'red', icon: '❌' }
  ],
  Conjunction: [
    { rule_type: 'do', title: 'DO', points: ['Use coordinating conjunctions to join equal ideas (and, but, or)', 'Use subordinating conjunctions to show relationships (because, although, since)', 'Use correlative conjunctions in pairs (either...or, both...and)'], color: 'green', icon: '✅' },
    { rule_type: 'dont', title: "DON'T", points: ['Don\'t overuse "and" — vary your conjunctions for better writing', 'Don\'t use run-on sentences; conjunctions must join complete ideas correctly', 'Don\'t confuse coordinating conjunctions with subordinating ones'], color: 'red', icon: '❌' }
  ],
  Interjection: [
    { rule_type: 'do', title: 'DO', points: ['Use interjections in dialogue to show emotion and realism', 'Punctuate mild interjections with commas (Oh, I see)', 'Punctuate strong interjections with exclamation marks (Wow! Amazing!)'], color: 'green', icon: '✅' },
    { rule_type: 'dont', title: "DON'T", points: ['Don\'t overuse interjections in formal writing', 'Don\'t forget that interjections are often separated by punctuation from the rest of the sentence', 'Don\'t use interjections in academic or professional contexts unless appropriate for tone'], color: 'red', icon: '❌' }
  ]
};

const examplesData = {
  Noun: [
    { sentence: 'She bought a beautiful <strong>book</strong> yesterday.', usage_pattern: 'Object of verb', category: 'Common' },
    { sentence: '<strong>John</strong> lives in <strong>London</strong>.', usage_pattern: 'Subject and prepositional object', category: 'Proper' },
    { sentence: 'Her <strong>kindness</strong> impressed everyone.', usage_pattern: 'Subject', category: 'Abstract' },
    { sentence: 'A <strong>herd</strong> of elephants walked across the plains.', usage_pattern: 'Subject', category: 'Collective' }
  ],
  Pronoun: [
    { sentence: '<strong>I</strong> love swimming, and <strong>she</strong> loves reading.', usage_pattern: 'Subjects', category: 'Personal' },
    { sentence: 'This <strong>book</strong> is <strong>mine</strong>, and that one is <strong>yours</strong>.', usage_pattern: 'Showing ownership', category: 'Possessive' },
    { sentence: '<strong>He</strong> taught <strong>himself</strong> to code.', usage_pattern: 'Subject and reflexive object', category: 'Reflexive' },
    { sentence: 'The girl <strong>who</strong> runs every morning is my neighbor.', usage_pattern: 'Connecting clauses', category: 'Relative' }
  ],
  Verb: [
    { sentence: 'She <strong>runs</strong> every morning.', usage_pattern: 'Action in present', category: 'Action' },
    { sentence: 'The cake <strong>is</strong> delicious.', usage_pattern: 'Linking subject to description', category: 'Linking' },
    { sentence: 'You <strong>can</strong> succeed if you try.', usage_pattern: 'Showing possibility', category: 'Modal' },
    { sentence: 'He <strong>gave up</strong> smoking.', usage_pattern: 'Verb with particle', category: 'Phrasal' }
  ],
  Adjective: [
    { sentence: 'The <strong>beautiful</strong> sunset was <strong>amazing</strong>.', usage_pattern: 'Describing nouns', category: 'Descriptive' },
    { sentence: '<strong>Few</strong> people knew about it.', usage_pattern: 'Describing quantity', category: 'Quantitative' },
    { sentence: '<strong>This</strong> house is bigger than <strong>that</strong> one.', usage_pattern: 'Pointing to specific things', category: 'Demonstrative' },
    { sentence: 'She is <strong>taller</strong> than her brother; she is the <strong>tallest</strong> in the family.', usage_pattern: 'Comparing', category: 'Comparative/Superlative' }
  ],
  Adverb: [
    { sentence: 'She spoke <strong>softly</strong>.', usage_pattern: 'How something happened', category: 'Manner' },
    { sentence: 'They arrive <strong>tomorrow</strong>.', usage_pattern: 'When something happens', category: 'Time' },
    { sentence: 'He went <strong>outside</strong>.', usage_pattern: 'Where something happens', category: 'Place' },
    { sentence: 'She <strong>always</strong> arrives on time.', usage_pattern: 'How often something happens', category: 'Frequency' }
  ],
  Preposition: [
    { sentence: 'The book is <strong>on</strong> the table.', usage_pattern: 'Showing location', category: 'Place' },
    { sentence: 'I\'ll call you <strong>at</strong> 3pm.', usage_pattern: 'Showing time', category: 'Time' },
    { sentence: 'She walked <strong>toward</strong> the door.', usage_pattern: 'Showing direction', category: 'Direction' },
    { sentence: 'This is a gift <strong>for</strong> you.', usage_pattern: 'Showing relationship', category: 'Relationship' }
  ],
  Conjunction: [
    { sentence: 'I like tea <strong>and</strong> coffee.', usage_pattern: 'Joining equal ideas', category: 'Coordinating' },
    { sentence: 'I study <strong>because</strong> I want to succeed.', usage_pattern: 'Connecting dependent clause', category: 'Subordinating' },
    { sentence: '<strong>Either</strong> you come or <strong>I</strong> go.', usage_pattern: 'Using paired conjunctions', category: 'Correlative' }
  ],
  Interjection: [
    { sentence: '<strong>Wow!</strong> That\'s amazing!', usage_pattern: 'Expressing strong emotion', category: 'Strong' },
    { sentence: '<strong>Oh,</strong> I didn\'t know that.', usage_pattern: 'Expressing mild reaction', category: 'Mild' },
    { sentence: '<strong>Ouch!</strong> That hurt!', usage_pattern: 'Expressing pain', category: 'Pain' }
  ]
};

const exercisesData = {
  Noun: [
    { exercise_type: 'writing', title: 'Identify Noun Types', prompt: 'Write 5 sentences using different noun types: proper, common, abstract, and collective.', passage: '', sample_answer: '1. Sarah enjoys painting abstract art. 2. The team won the championship. 3. London is a beautiful city. 4. Honesty is the best policy.' },
    { exercise_type: 'reading', title: 'Identify Nouns in Passage', prompt: 'Read the passage and highlight all nouns.', passage: 'Maria and her friends visited the museum in Paris. They saw famous paintings and sculptures. The experience was unforgettable.', sample_answer: 'Nouns: Maria, friends, museum, Paris, paintings, sculptures, experience' }
  ],
  Pronoun: [
    { exercise_type: 'writing', title: 'Replace with Pronouns', prompt: 'Rewrite sentences using pronouns instead of repeating nouns.', passage: '', sample_answer: 'Original: John loves John\'s job. Revised: John loves his job.' },
    { exercise_type: 'reading', title: 'Find Pronoun Antecedents', prompt: 'Identify the antecedent for each pronoun.', passage: 'Sarah met her friends at the park. They enjoyed playing games together.', sample_answer: 'her = Sarah; They = Sarah and her friends' }
  ],
  Verb: [
    { exercise_type: 'writing', title: 'Write in Different Tenses', prompt: 'Write 3 sentences in past, present, and future tense.', passage: '', sample_answer: 'Past: I walked to school. Present: I walk to school. Future: I will walk to school.' },
    { exercise_type: 'reading', title: 'Identify Verb Tenses', prompt: 'Read and identify the tense of each verb.', passage: 'She was reading when I called. I am waiting for your response.', sample_answer: 'was reading = past continuous; am waiting = present continuous' }
  ],
  Adjective: [
    { exercise_type: 'writing', title: 'Describe with Adjectives', prompt: 'Write 4 sentences describing a place using different adjectives.', passage: '', sample_answer: '1. The beautiful garden has colorful flowers. 2. The old house is massive. 3. The quiet park is peaceful. 4. The warm weather is delightful.' },
    { exercise_type: 'reading', title: 'Find and Count Adjectives', prompt: 'Identify all adjectives in the passage.', passage: 'The tall, dark stranger wore an expensive suit. His sharp eyes looked serious.', sample_answer: 'Adjectives: tall, dark, expensive, sharp, serious' }
  ],
  Adverb: [
    { exercise_type: 'writing', title: 'Add Adverbs to Sentences', prompt: 'Rewrite sentences adding adverbs to describe manner, time, and frequency.', passage: '', sample_answer: '1. She speaks clearly (manner). 2. They arrive tomorrow (time). 3. He always helps (frequency).' },
    { exercise_type: 'reading', title: 'Identify Adverbs and Their Type', prompt: 'Find all adverbs and classify them.', passage: 'He walked slowly through the garden yesterday. He rarely complains.', sample_answer: 'slowly (manner), yesterday (time), rarely (frequency)' }
  ],
  Preposition: [
    { exercise_type: 'writing', title: 'Use Prepositions Correctly', prompt: 'Write sentences using prepositions of place, time, and direction.', passage: '', sample_answer: '1. The book is on the shelf (place). 2. I\'ll see you at noon (time). 3. She ran toward the exit (direction).' },
    { exercise_type: 'reading', title: 'Find Prepositions and Their Objects', prompt: 'Identify prepositions and their objects.', passage: 'She sat in the chair by the window during the afternoon.', sample_answer: 'in (chair), by (window), during (afternoon)' }
  ],
  Conjunction: [
    { exercise_type: 'writing', title: 'Combine Sentences with Conjunctions', prompt: 'Combine simple sentences using coordinating and subordinating conjunctions.', passage: '', sample_answer: '1. I study hard and work well (and). 2. I will go if you come (if). 3. She is smart although she is young (although).' },
    { exercise_type: 'reading', title: 'Identify Conjunctions and Their Type', prompt: 'Find all conjunctions and classify them.', passage: 'Either you study or you fail. I came because I wanted to help.', sample_answer: 'or (coordinating), because (subordinating)' }
  ],
  Interjection: [
    { exercise_type: 'writing', title: 'Write Dialogue with Interjections', prompt: 'Write a short dialogue including at least 3 interjections.', passage: '', sample_answer: '"Wow! I can\'t believe you\'re here!" "Oh, I came as soon as I could. Ouch! I hit my head!"' },
    { exercise_type: 'reading', title: 'Identify Interjections in Dialogue', prompt: 'Find all interjections in the passage.', passage: '"Oh, that\'s wonderful! Wow, I\'m so happy! Ouch, be careful!"', sample_answer: 'Interjections: Oh, Wow, Ouch' }
  ]
};

const quizQuestionsData = {
  Noun: [
    { emoji: '📦', question: 'Which is a proper noun?', question_type: 'multiple-choice', hint: 'Proper nouns are capitalized.', options: ['dog', 'Paris', 'book', 'city'], correct_answer: 1, explanation: '"Paris" is a proper noun naming a specific city.' },
    { emoji: '🏠', question: 'Which of these is a collective noun?', question_type: 'multiple-choice', hint: 'A collective noun names a group.', options: ['table', 'team', 'happiness', 'quick'], correct_answer: 1, explanation: '"Team" is a collective noun for a group of people.' },
    { emoji: '💭', question: 'Identify the abstract noun: "Her <strong>courage</strong> inspired everyone."', question_type: 'multiple-choice', hint: 'Abstract nouns cannot be touched.', options: ['Her', 'courage', 'everyone', 'inspired'], correct_answer: 1, explanation: '"Courage" is an abstract noun representing an idea/emotion.' }
  ],
  Pronoun: [
    { emoji: '👤', question: 'Choose the correct pronoun: "Sarah and ___ love ice cream."', question_type: 'multiple-choice', hint: 'Use "I" for yourself with others.', options: ['me', 'I', 'myself', 'mine'], correct_answer: 1, explanation: '"I" is correct because it\'s part of the subject.' },
    { emoji: '🔄', question: 'Which sentence uses pronouns correctly?', question_type: 'multiple-choice', hint: 'Pronouns must agree with antecedents.', options: ['Each student should bring his or her books.', 'Every student should bring their books.', 'Both A and B are acceptable.', 'Neither is correct.'], correct_answer: 2, explanation: 'Both forms are acceptable in modern English.' }
  ],
  Verb: [
    { emoji: '⏳', question: 'Which is present continuous?', question_type: 'multiple-choice', hint: 'be + -ing form', options: ['I eat', 'I am eating', 'I ate', 'I will eat'], correct_answer: 1, explanation: '"I am eating" is present continuous.' },
    { emoji: '🔗', question: 'Which is a phrasal verb?', question_type: 'multiple-choice', hint: 'Verb + particle combination.', options: ['give up', 'run', 'think', 'study'], correct_answer: 0, explanation: '"Give up" is a phrasal verb.' }
  ],
  Adjective: [
    { emoji: '🎨', question: 'Which word is an adjective?', question_type: 'multiple-choice', hint: 'Adjectives describe nouns.', options: ['beautiful', 'beauty', 'beautifully', 'beautify'], correct_answer: 0, explanation: '"Beautiful" is an adjective.' },
    { emoji: '⚖️', question: 'Complete: "My house is ___ than yours."', question_type: 'multiple-choice', hint: 'Use comparative form.', options: ['big', 'bigger', 'biggest', 'most big'], correct_answer: 1, explanation: '"Bigger" is the correct comparative form.' }
  ],
  Adverb: [
    { emoji: '⚡', question: 'Choose the correct adverb: "She speaks ___."', question_type: 'multiple-choice', hint: 'Usually ends in -ly.', options: ['quick', 'quickly', 'quickness', 'quicker'], correct_answer: 1, explanation: '"Quickly" is the correct adverb.' },
    { emoji: '🔁', question: 'Which adverb shows frequency?', question_type: 'multiple-choice', hint: 'How often?', options: ['slowly', 'yesterday', 'always', 'here'], correct_answer: 2, explanation: '"Always" indicates frequency.' }
  ],
  Preposition: [
    { emoji: '📍', question: 'Fill in: "The book is ___ the table."', question_type: 'multiple-choice', hint: 'Location/place.', options: ['in', 'on', 'at', 'by'], correct_answer: 1, explanation: '"On" is correct for a book placed on a surface.' },
    { emoji: '⏳', question: 'Which preposition shows time?', question_type: 'multiple-choice', hint: 'When does something happen?', options: ['under', 'during', 'behind', 'through'], correct_answer: 1, explanation: '"During" shows the time when something happens.' }
  ],
  Conjunction: [
    { emoji: '➕', question: 'Complete: "I like tea ___ coffee."', question_type: 'multiple-choice', hint: 'Joining equal ideas.', options: ['because', 'and', 'but', 'although'], correct_answer: 1, explanation: '"And" joins two equal ideas (coordinating conjunction).' },
    { emoji: '🔽', question: 'Which is a subordinating conjunction?', question_type: 'multiple-choice', hint: 'Connects dependent clauses.', options: ['and', 'because', 'or', 'nor'], correct_answer: 1, explanation: '"Because" is a subordinating conjunction.' }
  ],
  Interjection: [
    { emoji: '😲', question: 'Which shows strong emotion?', question_type: 'multiple-choice', hint: 'Exclamation mark suggested.', options: ['um', 'oh', 'Wow!', 'hmm'], correct_answer: 2, explanation: '"Wow!" expresses strong emotion.' },
    { emoji: '⚠️', question: 'Complete the dialogue: "___ I didn\'t know that!"', question_type: 'multiple-choice', hint: 'Mild surprise/reaction.', options: ['Wow!', 'Oh', 'Ouch!', 'Yay!'], correct_answer: 1, explanation: '"Oh" is a mild interjection for light surprise.' }
  ]
};

const resourcesData = {
  Noun: [
    { title: 'Noun Basics Guide', url: 'https://www.englishclub.com/grammar/nouns.html', description: 'Comprehensive guide to nouns with examples and exercises.', resource_type: 'article', video_embed_id: null },
    { title: 'Noun Types Video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Clear explanation of noun types with visual examples.', resource_type: 'video', video_embed_id: 'dQw4w9WgXcQ' }
  ],
  Pronoun: [
    { title: 'Pronoun Reference Guide', url: 'https://www.englishclub.com/grammar/pronouns.html', description: 'Complete guide to all types of pronouns.', resource_type: 'article', video_embed_id: null },
    { title: 'Pronoun Types Explained', url: 'https://www.youtube.com/embed/9bZkp7q19f0', description: 'Video tutorial on personal, possessive, and reflexive pronouns.', resource_type: 'video', video_embed_id: '9bZkp7q19f0' }
  ],
  Verb: [
    { title: 'Verb Tenses Guide', url: 'https://www.englishclub.com/grammar/verb-tenses.htm', description: 'Detailed explanation of English verb tenses.', resource_type: 'article', video_embed_id: null },
    { title: 'Phrasal Verbs List', url: 'https://www.ef.edu/english-resources/english-phrases/phrasal-verbs/', description: 'Comprehensive list of common phrasal verbs.', resource_type: 'link', video_embed_id: null }
  ],
  Adjective: [
    { title: 'Adjective Rules', url: 'https://www.englishclub.com/grammar/adjectives.html', description: 'Guide to using adjectives correctly.', resource_type: 'article', video_embed_id: null },
    { title: 'Comparing Adjectives', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Video on comparative and superlative adjectives.', resource_type: 'video', video_embed_id: 'dQw4w9WgXcQ' }
  ],
  Adverb: [
    { title: 'Adverb Placement Guide', url: 'https://www.englishclub.com/grammar/adverbs.html', description: 'Learn where to place adverbs in sentences.', resource_type: 'article', video_embed_id: null },
    { title: 'Adverbs Explained', url: 'https://www.youtube.com/embed/9bZkp7q19f0', description: 'Video explanation of adverbs and their types.', resource_type: 'video', video_embed_id: '9bZkp7q19f0' }
  ],
  Preposition: [
    { title: 'Preposition Guide', url: 'https://www.englishclub.com/grammar/prepositions.html', description: 'Complete guide to English prepositions.', resource_type: 'article', video_embed_id: null },
    { title: 'Prepositions of Time & Place', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Video on using prepositions correctly.', resource_type: 'video', video_embed_id: 'dQw4w9WgXcQ' }
  ],
  Conjunction: [
    { title: 'Conjunction Basics', url: 'https://www.englishclub.com/grammar/conjunctions.html', description: 'Guide to coordinating and subordinating conjunctions.', resource_type: 'article', video_embed_id: null },
    { title: 'Using Conjunctions', url: 'https://www.youtube.com/embed/9bZkp7q19f0', description: 'Video on how to use different types of conjunctions.', resource_type: 'video', video_embed_id: '9bZkp7q19f0' }
  ],
  Interjection: [
    { title: 'Interjections Guide', url: 'https://www.englishclub.com/grammar/interjections.html', description: 'Guide to using interjections in English.', resource_type: 'article', video_embed_id: null },
    { title: 'Interjections in Dialogue', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Video on how to use interjections naturally in conversations.', resource_type: 'video', video_embed_id: 'dQw4w9WgXcQ' }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting grammar seed...');

    // Sync all tables (create if they don't exist)
    console.log('Syncing database tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synced');

    // Clear existing data
    await sequelize.truncate({ cascade: true, force: true });

    // Seed Parts of Speech
    console.log('Seeding parts of speech...');
    const partsOfSpeech = await Promise.all(
      partsOfSpeechData.map(part =>
        PartOfSpeech.create(part)
      )
    );
    console.log(`✅ Created ${partsOfSpeech.length} parts of speech`);

    // Seed all related data
    for (const part of partsOfSpeech) {
      const partName = part.name;

      // Seed Types
      const types = typesData[partName] || [];
      for (const type of types) {
        await GrammarType.create({
          part_id: part.id,
          name: type.name,
          description: type.description,
          icon: type.icon,
          examples: type.examples,
          sample_words: type.sampleWords,
          color: type.color
        });
      }
      console.log(`✅ Created ${types.length} types for ${partName}`);

      // Seed Rules
      const rules = rulesData[partName] || [];
      for (const rule of rules) {
        await GrammarRule.create({
          part_id: part.id,
          rule_type: rule.rule_type,
          title: rule.title,
          points: rule.points,
          color: rule.color,
          icon: rule.icon
        });
      }
      console.log(`✅ Created ${rules.length} rule groups for ${partName}`);

      // Seed Examples
      const examples = examplesData[partName] || [];
      for (const example of examples) {
        await GrammarExample.create({
          part_id: part.id,
          sentence: example.sentence,
          usage_pattern: example.usage_pattern,
          category: example.category
        });
      }
      console.log(`✅ Created ${examples.length} examples for ${partName}`);

      // Seed Exercises
      const exercises = exercisesData[partName] || [];
      for (const exercise of exercises) {
        await GrammarExercise.create({
          part_id: part.id,
          exercise_type: exercise.exercise_type,
          title: exercise.title,
          prompt: exercise.prompt,
          passage: exercise.passage,
          sample_answer: exercise.sample_answer
        });
      }
      console.log(`✅ Created ${exercises.length} exercises for ${partName}`);

      // Seed Quiz Questions
      const quizzes = quizQuestionsData[partName] || [];
      for (const quiz of quizzes) {
        await GrammarQuizQuestion.create({
          part_id: part.id,
          emoji: quiz.emoji,
          question: quiz.question,
          question_type: quiz.question_type,
          hint: quiz.hint,
          options: quiz.options,
          correct_answer: quiz.correct_answer,
          explanation: quiz.explanation
        });
      }
      console.log(`✅ Created ${quizzes.length} quiz questions for ${partName}`);

      // Seed Resources
      const resources = resourcesData[partName] || [];
      for (const resource of resources) {
        await GrammarResource.create({
          part_id: part.id,
          title: resource.title,
          url: resource.url,
          description: resource.description,
          resource_type: resource.resource_type,
          video_embed_id: resource.video_embed_id
        });
      }
      console.log(`✅ Created ${resources.length} resources for ${partName}`);
    }

    console.log('✅ Grammar seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
