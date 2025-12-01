const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('english_portal', 'myuser', 'mayu', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

const nounTypesData = {
  249: { // Proper Nouns
    name: "Proper Nouns",
    definition: "A proper noun is a noun that names a specific person, place, organization, or thing. Proper nouns are always capitalized in English.",
    video_resources: [
      {
        "title": "Proper Nouns and Capitalization Rules",
        "platform": "YouTube",
        "duration": "9:30",
        "description": "Master the rules for capitalizing proper nouns with clear examples and practice",
        "key_topics": ["Capitalization", "People names", "Place names", "Brands and organizations"]
      },
      {
        "title": "Common vs Proper Nouns Explained",
        "platform": "YouTube",
        "duration": "11:15",
        "description": "Understanding the difference between common and proper nouns with real-world examples",
        "key_topics": ["Comparison", "Examples", "When to capitalize", "Practice exercises"]
      },
      {
        "title": "Proper Nouns in Writing",
        "platform": "YouTube",
        "duration": "7:45",
        "description": "How to use proper nouns effectively in essays, stories, and formal writing",
        "key_topics": ["Writing techniques", "Formal writing", "Titles", "Names in context"]
      }
    ],
    additional_resources: [
      {
        "type": "Interactive Quiz",
        "title": "Proper Noun Capitalization Challenge",
        "description": "Test your capitalization skills with 100+ sentences requiring proper noun identification",
        "url": "Grammar practice websites"
      },
      {
        "type": "Printable Guide",
        "title": "Complete Capitalization Rules for Proper Nouns",
        "description": "Downloadable PDF guide covering all capitalization rules with examples",
        "url": "Educational resource sites"
      },
      {
        "type": "Writing Tool",
        "title": "Proper Noun Checker",
        "description": "Online tool to check if your proper nouns are capitalized correctly",
        "url": "Writing assistance platforms"
      },
      {
        "type": "Reference Book",
        "title": "The Chicago Manual of Style",
        "description": "Comprehensive guide to proper noun usage and capitalization in professional writing",
        "url": "Available at bookstores"
      },
      {
        "type": "Mobile App",
        "title": "Grammar Police: Capitalization Edition",
        "description": "Fun app for practicing proper noun identification and capitalization",
        "url": "App stores"
      }
    ],
    fun_facts: [
      {
        "fact": "The days of the week and months are proper nouns in English, but not in many other languages! French says 'lundi' (Monday) without a capital.",
        "icon": "📅"
      },
      {
        "fact": "Brand names like 'Google' and 'Kleenex' have become so common that people use them as verbs! 'I'll google it' shows how proper nouns evolve.",
        "icon": "🔍"
      },
      {
        "fact": "Some proper nouns have become common nouns! 'Sandwich' was named after the Earl of Sandwich, but now 'sandwich' is a common noun (lowercase).",
        "icon": "🥪"
      },
      {
        "fact": "The word 'I' is always capitalized in English, making it both a pronoun and following proper noun capitalization rules!",
        "icon": "✍️"
      },
      {
        "fact": "There are over 7.9 billion proper nouns just for people's names on Earth—and that's not counting places, brands, and organizations!",
        "icon": "🌍"
      },
      {
        "fact": "Some countries have laws about proper nouns! Iceland has a committee that must approve all children's names to be official proper nouns.",
        "icon": "⚖️"
      }
    ]
  },
  254: { // Uncountable Nouns
    name: "Uncountable Nouns",
    definition: "An uncountable noun (also called a mass noun or non-count noun) is a noun that cannot be counted individually and has no plural form. It represents substances, concepts, or collective masses.",
    video_resources: [
      {
        "title": "Uncountable Nouns: Complete Guide",
        "platform": "YouTube",
        "duration": "10:50",
        "description": "Everything you need to know about uncountable nouns with examples and practice",
        "key_topics": ["Definition", "Common uncountable nouns", "Quantifiers", "Making uncountable nouns countable"]
      },
      {
        "title": "Much vs Many: Uncountable vs Countable",
        "platform": "YouTube",
        "duration": "8:20",
        "description": "Master the difference between quantifiers for countable and uncountable nouns",
        "key_topics": ["Much/many", "Little/few", "Some/any", "Practice exercises"]
      },
      {
        "title": "Uncountable Nouns in Real Conversations",
        "platform": "YouTube",
        "duration": "12:10",
        "description": "Learn how native speakers use uncountable nouns naturally in everyday English",
        "key_topics": ["Natural usage", "Common mistakes", "Containers and measures", "Real examples"]
      }
    ],
    additional_resources: [
      {
        "type": "Interactive List",
        "title": "500 Most Common Uncountable Nouns",
        "description": "Comprehensive searchable database of uncountable nouns with examples",
        "url": "Grammar reference websites"
      },
      {
        "type": "Practice Exercises",
        "title": "Countable vs Uncountable Nouns Workbook",
        "description": "Downloadable workbook with 200+ exercises and answer keys",
        "url": "Educational platforms"
      },
      {
        "type": "Flashcard App",
        "title": "Uncountable Nouns Flashcards",
        "description": "Digital flashcards with audio pronunciation for 300+ uncountable nouns",
        "url": "Language learning apps"
      },
      {
        "type": "Grammar Guide",
        "title": "Practical English Usage by Michael Swan",
        "description": "Authoritative guide with excellent section on uncountable nouns",
        "url": "Available at bookstores"
      },
      {
        "type": "Online Course",
        "title": "English Nouns Masterclass",
        "description": "Complete course covering all noun types with special focus on uncountable nouns",
        "url": "Online learning platforms"
      }
    ],
    fun_facts: [
      {
        "fact": "The word 'news' looks plural but is uncountable! You say 'the news is good,' not 'the news are good.'",
        "icon": "📰"
      },
      {
        "fact": "Many uncountable nouns in English are countable in other languages! 'Bread' is uncountable in English but 'ein Brot' (one bread) in German.",
        "icon": "🍞"
      },
      {
        "fact": "You can make uncountable nouns countable by adding containers: 'water' becomes 'a glass of water' or 'three bottles of water.'",
        "icon": "💧"
      },
      {
        "fact": "'Hair' is uncountable when talking about all the hair on your head, but countable when talking about individual strands: 'I found a hair in my soup!'",
        "icon": "💇"
      },
      {
        "fact": "Money is uncountable, but coins and bills are countable! You can't say 'one money,' but you can say 'one dollar' or 'five coins.'",
        "icon": "💵"
      },
      {
        "fact": "Some words change meaning when used as countable vs uncountable: 'paper' (uncountable material) vs 'a paper' (countable newspaper or document).",
        "icon": "📄"
      }
    ]
  },
  255: { // Collective Nouns
    name: "Collective Nouns",
    definition: "A collective noun is a noun that refers to a group of people, animals, or things as a single unit. While representing multiple members, it is treated as singular or plural depending on context.",
    video_resources: [
      {
        "title": "Collective Nouns and Subject-Verb Agreement",
        "platform": "YouTube",
        "duration": "11:30",
        "description": "Learn when collective nouns take singular vs plural verbs with clear rules",
        "key_topics": ["Singular vs plural", "British vs American English", "Agreement rules", "Common examples"]
      },
      {
        "title": "Fun Collective Nouns for Animals",
        "platform": "YouTube",
        "duration": "8:55",
        "description": "Discover fascinating collective nouns like 'a murder of crows' and 'a parliament of owls'",
        "key_topics": ["Animal groups", "Origin of terms", "Unusual collective nouns", "Memory tricks"]
      },
      {
        "title": "Collective Nouns in Professional Writing",
        "platform": "YouTube",
        "duration": "10:15",
        "description": "Master the use of collective nouns in business and academic writing",
        "key_topics": ["Formal writing", "Team vs teams", "Committee usage", "Style guides"]
      }
    ],
    additional_resources: [
      {
        "type": "Reference List",
        "title": "Complete List of Collective Nouns",
        "description": "Comprehensive list of 300+ collective nouns for people, animals, and objects",
        "url": "Grammar reference sites"
      },
      {
        "type": "Quiz Game",
        "title": "Collective Noun Challenge",
        "description": "Fun quiz game matching collective nouns with their groups",
        "url": "Educational game platforms"
      },
      {
        "type": "Infographic",
        "title": "Visual Guide to Animal Collective Nouns",
        "description": "Downloadable poster with illustrated collective nouns for 50+ animals",
        "url": "Educational resource websites"
      },
      {
        "type": "Writing Tool",
        "title": "Collective Noun Agreement Checker",
        "description": "Online tool to verify correct verb agreement with collective nouns",
        "url": "Writing assistance platforms"
      },
      {
        "type": "Book",
        "title": "An Exaltation of Larks",
        "description": "Classic book about the history and humor of collective nouns",
        "url": "Available at bookstores"
      }
    ],
    fun_facts: [
      {
        "fact": "A group of crows is called 'a murder'! Many collective nouns for animals have dark or poetic names from medieval hunting culture.",
        "icon": "🐦‍⬛"
      },
      {
        "fact": "British English treats collective nouns as plural more often than American English: British say 'the team are,' Americans say 'the team is.'",
        "icon": "🇬🇧🇺🇸"
      },
      {
        "fact": "Some collective nouns are wonderfully specific: 'a blessing of unicorns,' 'a wisdom of wombats,' and 'an implausibility of gnus'!",
        "icon": "🦄"
      },
      {
        "fact": "The word 'parliament' means both a legislative body AND a group of owls! Owls were considered wise, hence the noble collective noun.",
        "icon": "🦉"
      },
      {
        "fact": "Modern collective nouns include 'a hashtag of tweets,' 'a cache of cookies' (computer), and 'a download of files'—language evolves!",
        "icon": "💻"
      },
      {
        "fact": "Many collective nouns were invented for fun! James Lipton's book created playful ones like 'a shrewdness of apes' and 'a crash of rhinoceroses.'",
        "icon": "📚"
      }
    ]
  },
  256: { // Compound Nouns
    name: "Compound Nouns",
    definition: "A compound noun is a noun made up of two or more words combined to create a new meaning. They can be written as one word, two words, or hyphenated.",
    video_resources: [
      {
        "title": "Compound Nouns: Three Types Explained",
        "platform": "YouTube",
        "duration": "10:40",
        "description": "Learn the difference between open, closed, and hyphenated compound nouns",
        "key_topics": ["Open compounds", "Closed compounds", "Hyphenated compounds", "Formation rules"]
      },
      {
        "title": "How to Form Compound Nouns",
        "platform": "YouTube",
        "duration": "9:25",
        "description": "Master the patterns for creating compound nouns from different word types",
        "key_topics": ["Noun+noun", "Adjective+noun", "Verb+noun", "Common patterns"]
      },
      {
        "title": "Compound Nouns in Natural English",
        "platform": "YouTube",
        "duration": "11:50",
        "description": "Real-world examples of how native speakers use compound nouns daily",
        "key_topics": ["Everyday compounds", "Business terms", "Technology compounds", "Natural usage"]
      }
    ],
    additional_resources: [
      {
        "type": "Interactive Dictionary",
        "title": "Compound Nouns Database",
        "description": "Searchable database of 1000+ compound nouns with definitions and examples",
        "url": "Grammar reference websites"
      },
      {
        "type": "Writing Guide",
        "title": "Hyphenation Rules for Compound Nouns",
        "description": "Comprehensive guide on when to use hyphens, spaces, or closed forms",
        "url": "Style guide resources"
      },
      {
        "type": "Practice App",
        "title": "Compound Noun Builder",
        "description": "Interactive app for practicing compound noun formation and spelling",
        "url": "Language learning apps"
      },
      {
        "type": "Reference Book",
        "title": "The AP Stylebook",
        "description": "Professional guide to compound noun usage in journalism and writing",
        "url": "Available at bookstores"
      },
      {
        "type": "Online Tool",
        "title": "Compound Noun Checker",
        "description": "Verify correct spelling and format of compound nouns",
        "url": "Writing assistance platforms"
      }
    ],
    fun_facts: [
      {
        "fact": "English creates new compound nouns constantly! Recent additions include 'smartphone,' 'cryptocurrency,' and 'selfie-stick.'",
        "icon": "📱"
      },
      {
        "fact": "The longest compound noun in English might be 'floccinaucinihilipilification' (29 letters), meaning 'the act of regarding something as worthless'!",
        "icon": "📏"
      },
      {
        "fact": "German is famous for compound nouns, but English uses them extensively too! We just write them as separate words more often.",
        "icon": "🇩🇪"
      },
      {
        "fact": "Some compounds change meaning dramatically: a 'greenhouse' (glass building) vs 'a green house' (house painted green)!",
        "icon": "🏠"
      },
      {
        "fact": "The stress pattern reveals compounds: 'BLACKboard' (compound = teaching board) vs 'black BOARD' (board that is black).",
        "icon": "🗣️"
      },
      {
        "fact": "Technology drives compound creation: 'laptop,' 'touchscreen,' and 'homepage' didn't exist 50 years ago!",
        "icon": "💻"
      }
    ]
  }
};

async function addMissingSections() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');
    console.log('=' * 80);
    console.log('ADDING MISSING SECTIONS TO NOUN TYPES');
    console.log('=' * 80);
    console.log();

    for (const [typeId, data] of Object.entries(nounTypesData)) {
      console.log(`\n🔄 Processing: ${data.name} (ID: ${typeId})`);
      console.log('-'.repeat(60));

      // Fetch current content
      const [results] = await sequelize.query(`
        SELECT id, name, learn_more_content
        FROM grammar_types
        WHERE id = ${typeId}
      `);

      if (results.length === 0) {
        console.log(`  ❌ Not found in database`);
        continue;
      }

      const currentContent = results[0].learn_more_content || {};
      
      // Add definition to overview if missing
      if (currentContent.overview && !currentContent.overview.definition) {
        currentContent.overview.definition = data.definition;
        console.log(`  ✅ Added overview.definition`);
      }

      // Add video_resources if missing
      if (!currentContent.video_resources || currentContent.video_resources.length === 0) {
        currentContent.video_resources = data.video_resources;
        console.log(`  ✅ Added ${data.video_resources.length} video resources`);
      }

      // Add additional_resources if missing
      if (!currentContent.additional_resources || currentContent.additional_resources.length === 0) {
        currentContent.additional_resources = data.additional_resources;
        console.log(`  ✅ Added ${data.additional_resources.length} additional resources`);
      }

      // Add fun_facts if missing
      if (!currentContent.fun_facts || currentContent.fun_facts.length === 0) {
        currentContent.fun_facts = data.fun_facts;
        console.log(`  ✅ Added ${data.fun_facts.length} fun facts`);
      }

      // Update the database
      await sequelize.query(`
        UPDATE grammar_types 
        SET learn_more_content = :content
        WHERE id = :id
      `, {
        replacements: {
          id: typeId,
          content: JSON.stringify(currentContent)
        }
      });

      console.log(`  ✅ Successfully updated ${data.name}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ ALL MISSING SECTIONS ADDED SUCCESSFULLY!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

addMissingSections();
