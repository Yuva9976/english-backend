const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('english_portal', 'myuser', 'mayu', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

const nounTypes = [
  { id: 249, name: 'Proper Nouns' },
  { id: 250, name: 'Common Nouns' },
  { id: 251, name: 'Concrete Nouns' },
  { id: 252, name: 'Abstract Nouns' },
  { id: 253, name: 'Countable Nouns' },
  { id: 254, name: 'Uncountable Nouns' },
  { id: 255, name: 'Collective Nouns' },
  { id: 256, name: 'Compound Nouns' }
];

const requiredSections = [
  'overview',
  'detailed_explanation',
  'video_resources',
  'grammar_rules',
  'examples',
  'common_mistakes',
  'practice_exercises',
  'quiz_questions',
  'additional_resources',
  'fun_facts'
];

async function checkAllData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');
    console.log('='* 80);
    console.log('COMPREHENSIVE DATA COMPLETENESS CHECK');
    console.log('='* 80);
    console.log();

    let allComplete = true;
    const missingData = [];

    for (const nounType of nounTypes) {
      console.log(`\n📚 Checking: ${nounType.name} (ID: ${nounType.id})`);
      console.log('-'.repeat(60));

      const [results] = await sequelize.query(`
        SELECT id, name, learn_more_content
        FROM grammar_types
        WHERE id = ${nounType.id}
      `);

      if (results.length === 0) {
        console.log(`  ❌ NOT FOUND IN DATABASE`);
        missingData.push({ noun: nounType.name, issue: 'Not found in database' });
        allComplete = false;
        continue;
      }

      const record = results[0];
      const content = record.learn_more_content;

      if (!content) {
        console.log(`  ❌ NO LEARN MORE CONTENT`);
        missingData.push({ noun: nounType.name, issue: 'No learn_more_content' });
        allComplete = false;
        continue;
      }

      console.log(`  ✅ Record exists with content`);
      
      // Check each required section
      const missingSections = [];
      for (const section of requiredSections) {
        if (!content[section]) {
          console.log(`    ❌ Missing section: ${section}`);
          missingSections.push(section);
        } else {
          // Check if section has actual data (not just empty object/array)
          const sectionData = content[section];
          const isEmpty = 
            (typeof sectionData === 'object' && Object.keys(sectionData).length === 0) ||
            (Array.isArray(sectionData) && sectionData.length === 0);
          
          if (isEmpty) {
            console.log(`    ⚠️  Section exists but is EMPTY: ${section}`);
            missingSections.push(`${section} (empty)`);
          } else {
            console.log(`    ✅ ${section}`);
            
            // Check subsections for specific sections
            if (section === 'overview') {
              const overviewChecks = ['definition', 'key_points', 'importance'];
              overviewChecks.forEach(check => {
                if (!sectionData[check]) {
                  console.log(`       ⚠️  Missing: overview.${check}`);
                  missingSections.push(`overview.${check}`);
                }
              });
            }
            
            if (section === 'examples' && sectionData.categories) {
              console.log(`       ℹ️  Examples has ${sectionData.categories.length} categories`);
              sectionData.categories.forEach((cat, idx) => {
                console.log(`          - ${cat.category}: ${cat.examples?.length || 0} examples`);
              });
            }
            
            if (section === 'quiz_questions') {
              ['easy', 'medium', 'hard'].forEach(level => {
                if (sectionData[level]) {
                  console.log(`       ℹ️  Quiz ${level}: ${sectionData[level].length} questions`);
                } else {
                  console.log(`       ⚠️  Missing quiz level: ${level}`);
                  missingSections.push(`quiz_questions.${level}`);
                }
              });
            }
            
            if (section === 'grammar_rules' && sectionData.rules) {
              console.log(`       ℹ️  Grammar rules: ${sectionData.rules.length} rules`);
            }
            
            if (section === 'common_mistakes') {
              console.log(`       ℹ️  Common mistakes: ${sectionData.length || 0} mistakes`);
            }
          }
        }
      }

      if (missingSections.length > 0) {
        missingData.push({
          noun: nounType.name,
          id: nounType.id,
          missingSections: missingSections
        });
        allComplete = false;
      }
    }

    // Summary Report
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY REPORT');
    console.log('='.repeat(80));

    if (allComplete) {
      console.log('\n🎉 EXCELLENT! All noun types have COMPLETE data!');
      console.log('✅ All 8 noun types');
      console.log('✅ All 10 required sections');
      console.log('✅ All subsections populated');
      console.log('\n🚀 Your Learn More system is FULLY READY!');
    } else {
      console.log('\n⚠️  Data completeness issues found:\n');
      
      missingData.forEach(item => {
        console.log(`📌 ${item.noun} (ID: ${item.id || 'N/A'})`);
        if (item.issue) {
          console.log(`   Issue: ${item.issue}`);
        }
        if (item.missingSections && item.missingSections.length > 0) {
          console.log(`   Missing/Empty sections (${item.missingSections.length}):`);
          item.missingSections.forEach(section => {
            console.log(`     • ${section}`);
          });
        }
        console.log();
      });

      console.log(`\n📊 Status: ${nounTypes.length - missingData.length}/${nounTypes.length} noun types complete`);
      console.log(`   Completion Rate: ${Math.round(((nounTypes.length - missingData.length) / nounTypes.length) * 100)}%`);
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkAllData();
