const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('english_portal', 'myuser', 'mayu', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

const concreteNounsData = {
  "overview": {
    "title": "What are Concrete Nouns?",
    "description": "Concrete nouns are words that name things you can experience with your five senses—things you can see, hear, smell, taste, or touch. They represent physical, tangible objects in the real world, making them easy to identify and understand.",
    "definition": "A concrete noun is a noun that refers to a physical, tangible object that can be perceived through the senses.",
    "key_points": [
      "Concrete nouns refer to physical objects you can experience with your senses",
      "They can be seen, touched, heard, smelled, or tasted",
      "Examples include: dog, tree, music, perfume, pizza",
      "They contrast with abstract nouns which represent ideas and concepts",
      "Concrete nouns make writing more vivid and descriptive",
      "They can be both common nouns (book) or proper nouns (Empire State Building)"
    ],
    "importance": "Concrete nouns are fundamental to descriptive writing and clear communication. They help readers visualize scenes, understand instructions, and connect with tangible reality. Mastering concrete nouns enhances your ability to write vividly and communicate effectively.",
    "common_words": ["book", "tree", "dog", "car", "house", "music", "flower", "phone", "table", "water", "sun", "mountain", "pizza", "perfume", "baby", "computer", "guitar", "rain", "bread", "ocean"]
  },
  "detailed_explanation": {
    "sections": [
      {
        "title": "Understanding Concrete Nouns",
        "content": "Concrete nouns are the building blocks of descriptive language. They name physical entities that exist in the material world—things that occupy space and can be experienced through our senses. Unlike abstract nouns which represent intangible concepts, concrete nouns ground our language in observable reality.",
        "subsections": [
          {
            "subtitle": "The Five Senses Test",
            "text": "To identify a concrete noun, apply the five senses test: Can you see it? Touch it? Hear it? Smell it? Taste it? If you can experience it through at least one sense, it's concrete. For example, 'thunder' is concrete because you can hear it, even though you can't touch or see it directly.",
            "examples": ["Visual: rainbow, sunset, painting", "Tactile: silk, ice, sand", "Auditory: thunder, music, laughter", "Olfactory: perfume, roses, coffee", "Gustatory: chocolate, lemon, honey"]
          },
          {
            "subtitle": "Physical vs. Abstract",
            "text": "The key distinction between concrete and abstract nouns is physicality. Concrete nouns have a physical form—they exist in the material world. Abstract nouns exist only as concepts, ideas, or qualities. This distinction is crucial for precise communication.",
            "examples": ["Concrete: desk, laptop, coffee cup", "Abstract: freedom, love, justice", "Concrete: smile (visible expression)", "Abstract: happiness (the feeling itself)"]
          },
          {
            "subtitle": "Types of Concrete Nouns",
            "text": "Concrete nouns encompass various categories: living things (people, animals, plants), non-living objects (furniture, vehicles, buildings), natural phenomena (rain, lightning, wind), and sensory experiences (sounds, smells, tastes). All share the common characteristic of being perceptible through the senses.",
            "examples": ["Living: elephant, teacher, oak tree", "Non-living: bicycle, bridge, smartphone", "Natural: earthquake, river, clouds", "Sensory: thunder, fragrance, sourness"]
          }
        ]
      },
      {
        "title": "Concrete Nouns in Context",
        "content": "Concrete nouns play a vital role in making writing vivid and engaging. They help readers visualize scenes, understand descriptions, and connect emotionally with stories. Writers use concrete nouns to create imagery and bring their words to life.",
        "subsections": [
          {
            "subtitle": "Creating Vivid Imagery",
            "text": "Concrete nouns transform bland descriptions into vivid pictures. Instead of saying 'she had a difficult day,' concrete nouns make it specific: 'she battled traffic jams, spilled coffee on her laptop, and dealt with a screaming baby.' The concrete nouns create a movie in the reader's mind.",
            "examples": ["Generic: She ate food", "Vivid: She devoured a juicy burger with crispy fries", "Generic: He drove a vehicle", "Vivid: He cruised in a sleek red convertible"]
          },
          {
            "subtitle": "Sensory Details",
            "text": "Effective writing engages multiple senses simultaneously. By combining concrete nouns that appeal to different senses, writers create immersive experiences. The smell of coffee, the warmth of sunshine, the sound of waves—these concrete nouns work together to transport readers.",
            "examples": ["Sight + Sound: flickering candles and crackling fireplace", "Smell + Taste: fresh basil and tangy tomatoes", "Touch + Sight: rough bark on towering redwoods"]
          }
        ]
      }
    ]
  },
  "video_resources": [
    {
      "title": "Concrete vs Abstract Nouns Explained",
      "platform": "YouTube",
      "duration": "8:45",
      "description": "Visual explanation of concrete nouns with real-world examples and the five senses test",
      "key_topics": ["Definition", "Examples", "Five senses test", "Comparison with abstract nouns"]
    },
    {
      "title": "Concrete Nouns in Descriptive Writing",
      "platform": "YouTube",
      "duration": "12:30",
      "description": "How to use concrete nouns to create vivid imagery and engage readers through sensory details",
      "key_topics": ["Sensory writing", "Show don't tell", "Creating imagery", "Writing techniques"]
    },
    {
      "title": "Identifying Concrete Nouns - Interactive Lesson",
      "platform": "YouTube",
      "duration": "6:15",
      "description": "Practice identifying concrete nouns in sentences with interactive exercises and tips",
      "key_topics": ["Identification strategies", "Practice exercises", "Common mistakes", "Quick tests"]
    }
  ],
  "grammar_rules": {
    "title": "Concrete Nouns Grammar Rules",
    "rules": [
      {
        "rule": "Concrete nouns can be singular or plural",
        "explanation": "Add -s, -es, or irregular plural forms",
        "examples": ["Singular: book → Plural: books", "Singular: box → Plural: boxes", "Singular: child → Plural: children"]
      },
      {
        "rule": "Concrete nouns can be countable or uncountable",
        "explanation": "Most concrete nouns are countable (one apple, two apples), but some are uncountable (water, sand, air)",
        "examples": ["Countable: three chairs, five dogs, ten books", "Uncountable: some water, much sand, little air"]
      },
      {
        "rule": "Articles are used with concrete nouns",
        "explanation": "Use 'a/an' for singular countable, 'the' for specific reference, or no article for plural/uncountable",
        "examples": ["A dog barked loudly", "The mountain was covered in snow", "Trees provide oxygen"]
      },
      {
        "rule": "Concrete nouns can be modified by adjectives",
        "explanation": "Adjectives describe qualities of concrete nouns, making them more specific",
        "examples": ["A red car", "The tall building", "An ancient tree", "Fresh bread"]
      },
      {
        "rule": "Concrete nouns can function as subjects or objects",
        "explanation": "They can perform actions (subject) or receive actions (object)",
        "examples": ["Subject: The dog chased the cat", "Object: She read the book", "Both: The teacher taught the students"]
      },
      {
        "rule": "Possessive forms show ownership",
        "explanation": "Add 's to singular nouns, s' to plural nouns ending in s",
        "examples": ["Singular: The cat's tail", "Plural: The dogs' kennels", "Irregular plural: The children's toys"]
      }
    ]
  },
  "examples": {
    "categories": [
      {
        "category": "Living Things",
        "icon": "🌿",
        "examples": [
          {
            "sentence": "The golden retriever wagged its tail excitedly.",
            "analysis": "'Golden retriever' is a concrete noun—a specific dog you can see and touch"
          },
          {
            "sentence": "Colorful butterflies danced around the lavender bushes.",
            "analysis": "'Butterflies' and 'lavender bushes' are concrete nouns you can observe visually"
          },
          {
            "sentence": "The ancient oak tree provided shade for the entire playground.",
            "analysis": "'Oak tree' and 'playground' are physical structures you can see and touch"
          },
          {
            "sentence": "A tiny hummingbird sipped nectar from the bright red flowers.",
            "analysis": "'Hummingbird' and 'flowers' are living concrete nouns perceptible through sight"
          },
          {
            "sentence": "The farmer harvested ripe tomatoes from his organic garden.",
            "analysis": "'Farmer,' 'tomatoes,' and 'garden' are all tangible, observable concrete nouns"
          }
        ]
      },
      {
        "category": "Objects & Things",
        "icon": "📦",
        "examples": [
          {
            "sentence": "She placed the antique vase carefully on the marble table.",
            "analysis": "'Vase' and 'table' are concrete nouns—physical objects you can touch and see"
          },
          {
            "sentence": "His smartphone slipped from his hand and landed on the soft carpet.",
            "analysis": "'Smartphone,' 'hand,' and 'carpet' are all tangible concrete nouns"
          },
          {
            "sentence": "The rusty bicycle leaned against the weathered brick wall.",
            "analysis": "'Bicycle' and 'wall' are physical structures you can see and touch"
          },
          {
            "sentence": "She opened the heavy wooden door with an old brass key.",
            "analysis": "'Door' and 'key' are concrete objects with physical properties"
          },
          {
            "sentence": "The bookshelf overflowed with colorful novels and magazines.",
            "analysis": "'Bookshelf,' 'novels,' and 'magazines' are all physical items"
          }
        ]
      },
      {
        "category": "Natural Phenomena",
        "icon": "🌤️",
        "examples": [
          {
            "sentence": "Thunder rumbled across the dark sky as lightning flashed.",
            "analysis": "'Thunder' and 'lightning' are concrete—you can hear and see them"
          },
          {
            "sentence": "The morning dew sparkled on the grass like tiny diamonds.",
            "analysis": "'Dew' and 'grass' are physical substances you can see and touch"
          },
          {
            "sentence": "Gentle rain tapped against the window throughout the night.",
            "analysis": "'Rain' and 'window' are concrete nouns perceptible through hearing and sight"
          },
          {
            "sentence": "The rainbow appeared over the mountain after the storm passed.",
            "analysis": "'Rainbow' and 'mountain' are visible natural phenomena"
          },
          {
            "sentence": "Thick fog blanketed the valley, obscuring the distant hills.",
            "analysis": "'Fog,' 'valley,' and 'hills' are all observable concrete nouns"
          }
        ]
      },
      {
        "category": "Sensory Experiences",
        "icon": "👃",
        "examples": [
          {
            "sentence": "The aroma of fresh coffee filled the entire kitchen.",
            "analysis": "'Aroma' and 'coffee' are concrete—you experience them through smell"
          },
          {
            "sentence": "She savored the sweetness of the ripe strawberries.",
            "analysis": "'Sweetness' and 'strawberries' are concrete nouns related to taste"
          },
          {
            "sentence": "The music from the piano drifted through the open window.",
            "analysis": "'Music' and 'piano' are concrete nouns you can hear and see"
          },
          {
            "sentence": "The scent of roses mingled with the smell of freshly cut grass.",
            "analysis": "'Scent,' 'roses,' 'smell,' and 'grass' are all sensory concrete nouns"
          },
          {
            "sentence": "The rough texture of the sandpaper scratched against the wood.",
            "analysis": "'Texture,' 'sandpaper,' and 'wood' are concrete—experienced through touch"
          }
        ]
      }
    ]
  },
  "common_mistakes": [
    {
      "mistake_number": 1,
      "error_type": "Confusing Concrete with Abstract",
      "frequency": "Very Common",
      "incorrect": "Happiness is a concrete noun because I can see it in someone's smile.",
      "correct": "The smile is a concrete noun (visible expression), but happiness is abstract (the feeling itself).",
      "explanation": "While you can observe the physical manifestation (smile) of an emotion, the emotion itself (happiness) is abstract. The noun 'happiness' represents a feeling, not a physical object.",
      "tip": "Ask: Can I physically touch the thing itself? A smile, yes. Happiness, no."
    },
    {
      "mistake_number": 2,
      "error_type": "Thinking All Nouns Are Either Fully Concrete or Abstract",
      "frequency": "Common",
      "incorrect": "Is 'voice' concrete or abstract? I'm confused.",
      "correct": "Voice is concrete—it's a sound you can hear, even though it's produced by abstract speech.",
      "explanation": "Some nouns blur the line, but if you can perceive it with your senses, it's concrete. Voice, music, and thunder are concrete because you hear them.",
      "tip": "Use the five senses test: If ANY of your senses can perceive it, it's concrete."
    },
    {
      "mistake_number": 3,
      "error_type": "Confusing the Source with the Noun",
      "frequency": "Common",
      "incorrect": "Love is concrete because love letters are physical objects.",
      "correct": "Letters are concrete (physical paper), but love itself is abstract (an emotion).",
      "explanation": "Don't confuse a representation of something with the thing itself. The physical letter is concrete; the emotion it expresses is abstract.",
      "tip": "Focus on what the noun itself represents, not what represents it."
    },
    {
      "mistake_number": 4,
      "error_type": "Assuming Invisible Things Are Abstract",
      "frequency": "Common",
      "incorrect": "Wind is abstract because I can't see it.",
      "correct": "Wind is concrete because I can feel it on my skin and hear it rustling leaves.",
      "explanation": "Concrete nouns don't have to be visible. If you can experience something through ANY sense (touch, hearing, smell, taste, or sight), it's concrete.",
      "tip": "Remember: concrete = perceivable by senses, not necessarily visible."
    },
    {
      "mistake_number": 5,
      "error_type": "Confusing Activities with Objects",
      "frequency": "Moderate",
      "incorrect": "Running is a concrete noun because I can see someone running.",
      "correct": "Running is an abstract gerund (verbal noun). The runner is concrete.",
      "explanation": "Activities, actions, and processes are abstract concepts, even if you can observe them happening. The person doing the action is concrete.",
      "tip": "Nouns ending in -ing that describe actions are typically abstract."
    },
    {
      "mistake_number": 6,
      "error_type": "Thinking Digital Things Are Abstract",
      "frequency": "Moderate",
      "incorrect": "Email is abstract because it's digital.",
      "correct": "Email is concrete—you can see it on a screen and read its content.",
      "explanation": "Digital content displayed on physical screens is concrete because it's perceivable through sight. You interact with it directly through your senses.",
      "tip": "If you can see, hear, or otherwise sense it, it's concrete—even if it's digital."
    },
    {
      "mistake_number": 7,
      "error_type": "Misidentifying Measurements",
      "frequency": "Moderate",
      "incorrect": "Temperature is concrete because I can feel hot and cold.",
      "correct": "Hot water is concrete; temperature is abstract (it's a measurement concept).",
      "explanation": "The physical sensation is concrete, but the measurement or concept of measuring is abstract. Feel the difference between the object and the quality.",
      "tip": "Physical objects are concrete; measurements and qualities are usually abstract."
    },
    {
      "mistake_number": 8,
      "error_type": "Confusing Proper Nouns with Concrete/Abstract",
      "frequency": "Less Common",
      "incorrect": "Paris is abstract because it's a name.",
      "correct": "Paris is both proper and concrete—it's a physical city you can visit and see.",
      "explanation": "Nouns can be multiple types simultaneously. Paris is a proper noun (specific name) and concrete (physical place).",
      "tip": "Proper nouns can be concrete (Paris, Mt. Everest) or abstract (Christianity, Democracy)."
    }
  ],
  "practice_exercises": {
    "identification": {
      "title": "Identify the Concrete Nouns",
      "instructions": "Read each sentence carefully and identify all the concrete nouns. Remember, concrete nouns are things you can perceive with your five senses.",
      "questions": [
        {
          "id": 1,
          "sentence": "The teacher wrote important notes on the whiteboard with a red marker.",
          "answer": ["teacher", "notes", "whiteboard", "marker"],
          "explanation": "All four nouns are concrete: you can see the teacher, notes, and whiteboard, and touch the marker."
        },
        {
          "id": 2,
          "sentence": "Sweet perfume drifted from the roses blooming in the garden.",
          "answer": ["perfume", "roses", "garden"],
          "explanation": "You can smell the perfume, see and smell the roses, and see/walk through the garden."
        },
        {
          "id": 3,
          "sentence": "The children heard thunder and saw lightning during the storm.",
          "answer": ["children", "thunder", "lightning", "storm"],
          "explanation": "All are concrete: children (visible/tangible), thunder (audible), lightning (visible), storm (multi-sensory experience)."
        },
        {
          "id": 4,
          "sentence": "She tasted the sour lemon and felt its bumpy texture.",
          "answer": ["lemon", "texture"],
          "explanation": "Lemon is concrete (taste, touch, sight), and texture is concrete (tactile experience)."
        },
        {
          "id": 5,
          "sentence": "The pianist's fingers danced across the ivory keys, creating beautiful music.",
          "answer": ["pianist", "fingers", "keys", "music"],
          "explanation": "All are concrete: pianist and fingers (visible/tangible), keys (tangible), music (audible)."
        },
        {
          "id": 6,
          "sentence": "Warm sunshine filtered through the curtains onto the wooden floor.",
          "answer": ["sunshine", "curtains", "floor"],
          "explanation": "Sunshine (visible/felt as warmth), curtains (visible/tangible), floor (visible/tangible)."
        },
        {
          "id": 7,
          "sentence": "The baker pulled fresh bread from the oven, filling the room with a delicious aroma.",
          "answer": ["baker", "bread", "oven", "room", "aroma"],
          "explanation": "All are perceivable through senses: baker, bread, oven, and room (visual/tangible); aroma (olfactory)."
        },
        {
          "id": 8,
          "sentence": "Cold ice cubes clinked in the glass of refreshing lemonade.",
          "answer": ["ice cubes", "glass", "lemonade"],
          "explanation": "All three are concrete nouns you can see, touch, and taste."
        }
      ]
    }
  },
  "quiz_questions": {
    "easy": [
      {
        "id": 1,
        "question": "Which of the following is a concrete noun?",
        "options": ["Freedom", "Happiness", "Table", "Justice"],
        "correct_answer": 2,
        "explanation": "Table is concrete because you can see and touch it. The others are abstract concepts."
      },
      {
        "id": 2,
        "question": "What makes a noun 'concrete'?",
        "options": ["It's made of concrete", "You can perceive it with your senses", "It's a proper noun", "It's always capitalized"],
        "correct_answer": 1,
        "explanation": "Concrete nouns can be perceived through one or more of the five senses."
      },
      {
        "id": 3,
        "question": "Which noun is concrete?",
        "options": ["Love", "Music", "Thought", "Hope"],
        "correct_answer": 1,
        "explanation": "Music is concrete because you can hear it. Love, thought, and hope are abstract feelings/concepts."
      },
      {
        "id": 4,
        "question": "Identify the concrete noun: 'The dog barked loudly at the mailman.'",
        "options": ["Barked", "Loudly", "Dog", "At"],
        "correct_answer": 2,
        "explanation": "Dog is a concrete noun (tangible animal). Barked is a verb, loudly is an adverb, and at is a preposition."
      },
      {
        "id": 5,
        "question": "Which sentence contains only concrete nouns?",
        "options": ["Love conquers fear", "The cat sat on the mat", "Happiness brings joy", "Freedom requires courage"],
        "correct_answer": 1,
        "explanation": "'Cat' and 'mat' are both concrete (visible/tangible). The other sentences contain abstract nouns."
      }
    ],
    "medium": [
      {
        "id": 1,
        "question": "Which of these is NOT a concrete noun?",
        "options": ["Thunder", "Perfume", "Democracy", "Rainbow"],
        "correct_answer": 2,
        "explanation": "Democracy is an abstract concept. Thunder (audible), perfume (olfactory), and rainbow (visible) are all concrete."
      },
      {
        "id": 2,
        "question": "In 'The warmth of the sun felt wonderful,' which word is concrete?",
        "options": ["Warmth", "Sun", "Felt", "Wonderful"],
        "correct_answer": 1,
        "explanation": "Sun is concrete (visible celestial body). Warmth is abstract (quality), felt is a verb, wonderful is an adjective."
      },
      {
        "id": 3,
        "question": "How many concrete nouns are in: 'The teacher's enthusiasm inspired the students'?",
        "options": ["0", "1", "2", "3"],
        "correct_answer": 2,
        "explanation": "Two concrete nouns: 'teacher' and 'students' (people). Enthusiasm is abstract."
      },
      {
        "id": 4,
        "question": "Which noun can be both abstract AND concrete depending on context?",
        "options": ["Beauty (the concept) vs. beauty (a beautiful person)", "Chair", "Water", "Pencil"],
        "correct_answer": 0,
        "explanation": "Beauty as a concept is abstract, but 'a beauty' referring to a person is concrete. The others are always concrete."
      },
      {
        "id": 5,
        "question": "Why is 'echo' considered a concrete noun?",
        "options": ["It's spelled with an E", "You can hear it", "It repeats sounds", "It travels through air"],
        "correct_answer": 1,
        "explanation": "Echo is concrete because you can perceive it through hearing, one of the five senses."
      }
    ],
    "hard": [
      {
        "id": 1,
        "question": "In 'His childhood memories included the taste of grandmother's cookies,' which nouns are concrete?",
        "options": ["Childhood, memories, taste, cookies", "Taste, grandmother, cookies", "Grandmother, cookies", "Only cookies"],
        "correct_answer": 2,
        "explanation": "Grandmother and cookies are concrete (tangible). Childhood and memories are abstract concepts; taste as a faculty is abstract, though what is tasted is concrete."
      },
      {
        "id": 2,
        "question": "Which statement about concrete nouns is FALSE?",
        "options": ["They must be visible to the eye", "They can be perceived through senses", "They can be living or non-living", "They can be natural or man-made"],
        "correct_answer": 0,
        "explanation": "Concrete nouns need not be visible—they can be perceived through any sense (hearing, smell, taste, touch, or sight)."
      },
      {
        "id": 3,
        "question": "Why is 'photograph' concrete but 'photography' often abstract?",
        "options": ["Photograph is older English", "Photograph is an object; photography is an art/process", "They're both abstract", "Photography refers to cameras"],
        "correct_answer": 1,
        "explanation": "A photograph is a physical object you can hold. Photography is the art/process/concept of taking photos—an abstract concept."
      },
      {
        "id": 4,
        "question": "'The silence was deafening.' What type of noun is 'silence' here?",
        "options": ["Concrete (you hear silence)", "Abstract (silence is absence of sound)", "Both concrete and abstract", "Neither—it's an adjective"],
        "correct_answer": 1,
        "explanation": "Silence is abstract—it's the absence or concept of no sound, not something you perceive directly through senses."
      },
      {
        "id": 5,
        "question": "In 'The smoke from the fire triggered the alarm,' which analysis is correct?",
        "options": ["Smoke, fire, alarm are concrete; triggered is abstract", "All nouns are concrete because you can sense them", "Only smoke is concrete", "Fire and alarm are abstract concepts"],
        "correct_answer": 1,
        "explanation": "Smoke (visible/smellable), fire (visible/felt), and alarm (visible/audible) are all concrete. Triggered is a verb, not a noun."
      }
    ]
  },
  "additional_resources": [
    {
      "type": "Interactive Website",
      "title": "Concrete vs Abstract Noun Quiz Game",
      "description": "Interactive quiz game with instant feedback and scoring to test your knowledge of concrete nouns",
      "url": "Grammar learning websites"
    },
    {
      "type": "Printable Worksheet",
      "title": "Concrete Nouns Identification Exercises",
      "description": "Downloadable PDF with 50+ sentences for practice identifying concrete nouns",
      "url": "Educational resource sites"
    },
    {
      "type": "Mobile App",
      "title": "Grammar Hero: Nouns Edition",
      "description": "Gamified learning app featuring concrete noun challenges and achievements",
      "url": "Available on app stores"
    },
    {
      "type": "Book Recommendation",
      "title": "The Elements of Style by Strunk & White",
      "description": "Classic writing guide with excellent sections on using concrete language for vivid writing",
      "url": "Available at bookstores"
    },
    {
      "type": "Online Course",
      "title": "Descriptive Writing Masterclass",
      "description": "Comprehensive course on using concrete nouns to create vivid imagery in writing",
      "url": "Online learning platforms"
    }
  ],
  "fun_facts": [
    {
      "fact": "The word 'concrete' comes from Latin 'concretus' meaning 'grown together' or 'hardened'—referring to something solid and tangible!",
      "icon": "🏛️"
    },
    {
      "fact": "Writers of bestselling novels use 3x more concrete nouns than abstract nouns to create vivid, engaging stories that readers can visualize.",
      "icon": "📚"
    },
    {
      "fact": "Children learn concrete nouns first! Babies typically learn words like 'mama,' 'ball,' and 'dog' before abstract concepts like 'love' or 'time.'",
      "icon": "👶"
    },
    {
      "fact": "The most concrete writing is found in instruction manuals and recipes—they need precise, physical details for readers to follow!",
      "icon": "📖"
    },
    {
      "fact": "Studies show that using concrete nouns makes your writing 40% more memorable than using abstract language!",
      "icon": "🧠"
    },
    {
      "fact": "Shakespeare used over 1,700 concrete nouns in his plays—from 'dagger' to 'daisy'—helping audiences visualize his vivid scenes!",
      "icon": "🎭"
    }
  ]
};

async function seedConcreteNouns() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    const typeId = 251; // Concrete Nouns
    
    console.log(`🔄 Updating Concrete Nouns (ID: ${typeId})...`);
    
    const [result] = await sequelize.query(`
      UPDATE grammar_types 
      SET learn_more_content = :content
      WHERE id = :id
      RETURNING id, name
    `, {
      replacements: {
        id: typeId,
        content: JSON.stringify(concreteNounsData)
      }
    });

    if (result.length > 0) {
      console.log(`✅ Successfully updated: ${result[0].name} (ID: ${result[0].id})`);
      console.log(`📊 Sections added: ${Object.keys(concreteNounsData).length}`);
      console.log(`   - Overview with ${concreteNounsData.overview.key_points.length} key points`);
      console.log(`   - ${concreteNounsData.detailed_explanation.sections.length} detailed sections`);
      console.log(`   - ${concreteNounsData.video_resources.length} video resources`);
      console.log(`   - ${concreteNounsData.grammar_rules.rules.length} grammar rules`);
      console.log(`   - ${concreteNounsData.examples.categories.length} example categories`);
      console.log(`   - ${concreteNounsData.common_mistakes.length} common mistakes`);
      console.log(`   - ${concreteNounsData.practice_exercises.identification.questions.length} practice questions`);
      console.log(`   - Quiz: ${concreteNounsData.quiz_questions.easy.length} easy, ${concreteNounsData.quiz_questions.medium.length} medium, ${concreteNounsData.quiz_questions.hard.length} hard`);
      console.log(`   - ${concreteNounsData.additional_resources.length} additional resources`);
      console.log(`   - ${concreteNounsData.fun_facts.length} fun facts`);
    } else {
      console.log('❌ No record found with that ID');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

seedConcreteNouns();
