const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const client = new Client({ connectionString: process.env.DATABASE_URL });

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row = {};
    
    // Simple CSV parser that handles quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    // Remove quotes from values
    const cleanValues = values.map(v => v.replace(/^"|"$/g, ''));
    
    headers.forEach((header, index) => {
      row[header.trim()] = cleanValues[index] || '';
    });
    data.push(row);
  }
  return data;
}

function parseOptions(optionsStr) {
  // Handle both formats: comma-separated or JSON array
  if (optionsStr.startsWith('[') && optionsStr.endsWith(']')) {
    try {
      return JSON.parse(optionsStr.replace(/'/g, '"'));
    } catch (e) {
      console.error('Error parsing JSON options:', optionsStr);
      return [];
    }
  } else {
    return optionsStr.split(',').map(opt => opt.trim().replace(/^"|"$/g, ''));
  }
}

async function importQuestions() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Insert question sets
    const firstSetId = '550e8400-e29b-41d4-a716-446655440000';
    const secondSetId = '550e8400-e29b-41d4-a716-446655440001';

    console.log('Inserting question sets...');
    await client.query(`
      INSERT INTO question_sets (set_id, set_name, set_number, description, is_active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (set_id) DO NOTHING
    `, [firstSetId, 'First Set', 1, 'Original question set', true]);

    await client.query(`
      INSERT INTO question_sets (set_id, set_name, set_number, description, is_active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (set_id) DO NOTHING
    `, [secondSetId, 'Second Set', 2, 'Additional question set', true]);

    // Read CSV files
    const firstSetPath = path.join(__dirname, '..', '..', '1st set options.xlsx - Sheet1.csv');
    const secondSetPath = path.join(__dirname, '..', '..', '2nd set.xlsx - Sheet1.csv');

    const firstSetCSV = fs.readFileSync(firstSetPath, 'utf8');
    const secondSetCSV = fs.readFileSync(secondSetPath, 'utf8');

    const firstSetData = parseCSV(firstSetCSV);
    const secondSetData = parseCSV(secondSetCSV);

    console.log(`Parsed ${firstSetData.length} questions from first set`);
    console.log(`Parsed ${secondSetData.length} questions from second set`);

    // Braided order: alternate between sets
    const braidedQuestions = [];
    const maxLength = Math.max(firstSetData.length, secondSetData.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < firstSetData.length) {
        braidedQuestions.push({ ...firstSetData[i], setId: firstSetId, originalIndex: i });
      }
      if (i < secondSetData.length) {
        braidedQuestions.push({ ...secondSetData[i], setId: secondSetId, originalIndex: i });
      }
    }

    console.log(`Total braided questions: ${braidedQuestions.length}`);

    // Insert questions
    for (let i = 0; i < braidedQuestions.length; i++) {
      const q = braidedQuestions[i];
      const cardNumber = parseInt(q.Card.replace('Card ', '').split(' ')[0]);
      const pageHeadline = q.Card.split(': ')[1] || q.Card.split(' – ')[1] || q.Card;
      const questionText = q.Question;
      const options = parseOptions(q.Options);

      console.log(`Inserting question ${i + 1}: ${questionText.substring(0, 50)}...`);

      // Insert question
      const questionResult = await client.query(`
        INSERT INTO questions (
          set_id, card_number, page_headline, question_text, question_subtitle,
          question_type, skip_allowed, rotation_tag, display_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING question_id
      `, [
        q.setId,
        cardNumber,
        pageHeadline,
        questionText,
        null,
        'multiple_choice',
        false,
        null,
        i + 1,
        true
      ]);

      const questionId = questionResult.rows[0].question_id;

      // Insert options
      for (let j = 0; j < options.length; j++) {
        const optionText = options[j];
        if (optionText && optionText !== 'Other') {
          await client.query(`
            INSERT INTO options (question_id, option_text, option_value, display_order, is_active)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            questionId,
            optionText,
            optionText,
            j + 1,
            true
          ]);
        }
      }
    }

    console.log('Import completed successfully!');

  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await client.end();
  }
}

importQuestions();