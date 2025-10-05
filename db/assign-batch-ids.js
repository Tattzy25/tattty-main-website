const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const client = new Client({ connectionString: process.env.DATABASE_URL });

// Batch ID constants
const BATCH_IDS = {
  BATCH_A: 'batch-a-s1-first-s2-first',
  BATCH_B: 'batch-b-s2-first-s1-first',
  BATCH_C: 'batch-c-s1-second-s2-second',
  BATCH_D: 'batch-d-s2-second-s1-second'
};

const SET_1_ID = '550e8400-e29b-41d4-a716-446655440000';
const SET_2_ID = '550e8400-e29b-41d4-a716-446655440001';

async function assignBatchesToQuestions() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Get all questions from both sets
    const questionsResult = await client.query(`
      SELECT question_id, set_id, card_number 
      FROM questions 
      WHERE is_active = true
      ORDER BY set_id, card_number
    `);

    const questions = questionsResult.rows;
    const set1Questions = questions.filter(q => q.set_id === SET_1_ID).sort((a, b) => a.card_number - b.card_number);
    const set2Questions = questions.filter(q => q.set_id === SET_2_ID).sort((a, b) => a.card_number - b.card_number);

    console.log(`Found ${set1Questions.length} questions in Set 1`);
    console.log(`Found ${set2Questions.length} questions in Set 2`);

    // Clear existing batch assignments
    await client.query('DELETE FROM batch_assignments');
    console.log('Cleared existing batch assignments');

    let assignmentCount = 0;

    // Helper function to insert batch assignment
    async function assignQuestionToBatch(questionId, batchId, position, setId, cardNumber) {
      await client.query(`
        INSERT INTO batch_assignments (question_id, batch_id, position)
        VALUES ($1, $2, $3)
        ON CONFLICT (question_id, batch_id) DO UPDATE SET position = $3
      `, [questionId, batchId, position]);
      assignmentCount++;
      const setLabel = setId === SET_1_ID ? 'Set1' : 'Set2';
      console.log(`  Position ${position}: ${setLabel}-Card${cardNumber} (${questionId})`);
    }

    // BATCH A: Set1[1-3] + Set2[1-3] braided (S1-1, S2-1, S1-2, S2-2, S1-3, S2-3)
    console.log(`\n📦 Assigning ${BATCH_IDS.BATCH_A}:`);
    let position = 1;
    for (let i = 0; i < 3; i++) {
      if (set1Questions[i]) {
        await assignQuestionToBatch(set1Questions[i].question_id, BATCH_IDS.BATCH_A, position++, set1Questions[i].set_id, set1Questions[i].card_number);
      }
      if (set2Questions[i]) {
        await assignQuestionToBatch(set2Questions[i].question_id, BATCH_IDS.BATCH_A, position++, set2Questions[i].set_id, set2Questions[i].card_number);
      }
    }

    // BATCH B: Set2[1-3] + Set1[1-3] braided (S2-1, S1-1, S2-2, S1-2, S2-3, S1-3)
    console.log(`\n📦 Assigning ${BATCH_IDS.BATCH_B}:`);
    position = 1;
    for (let i = 0; i < 3; i++) {
      if (set2Questions[i]) {
        await assignQuestionToBatch(set2Questions[i].question_id, BATCH_IDS.BATCH_B, position++, set2Questions[i].set_id, set2Questions[i].card_number);
      }
      if (set1Questions[i]) {
        await assignQuestionToBatch(set1Questions[i].question_id, BATCH_IDS.BATCH_B, position++, set1Questions[i].set_id, set1Questions[i].card_number);
      }
    }

    // BATCH C: Set1[4-6] + Set2[4-6] braided (S1-4, S2-4, S1-5, S2-5, S1-6, S2-6)
    console.log(`\n📦 Assigning ${BATCH_IDS.BATCH_C}:`);
    position = 1;
    for (let i = 3; i < 6; i++) {
      if (set1Questions[i]) {
        await assignQuestionToBatch(set1Questions[i].question_id, BATCH_IDS.BATCH_C, position++, set1Questions[i].set_id, set1Questions[i].card_number);
      }
      if (set2Questions[i]) {
        await assignQuestionToBatch(set2Questions[i].question_id, BATCH_IDS.BATCH_C, position++, set2Questions[i].set_id, set2Questions[i].card_number);
      }
    }

    // BATCH D: Set2[4-6] + Set1[4-6] braided (S2-4, S1-4, S2-5, S1-5, S2-6, S1-6)
    console.log(`\n📦 Assigning ${BATCH_IDS.BATCH_D}:`);
    position = 1;
    for (let i = 3; i < 6; i++) {
      if (set2Questions[i]) {
        await assignQuestionToBatch(set2Questions[i].question_id, BATCH_IDS.BATCH_D, position++, set2Questions[i].set_id, set2Questions[i].card_number);
      }
      if (set1Questions[i]) {
        await assignQuestionToBatch(set1Questions[i].question_id, BATCH_IDS.BATCH_D, position++, set1Questions[i].set_id, set1Questions[i].card_number);
      }
    }

    console.log(`\n✅ Successfully assigned ${assignmentCount} batch assignments across 4 batches!`);

    // Verify the assignments
    console.log('\n🔍 Verifying batch assignments:');
    for (const batchId of Object.values(BATCH_IDS)) {
      const result = await client.query(`
        SELECT COUNT(*) as count 
        FROM batch_assignments 
        WHERE batch_id = $1
      `, [batchId]);
      console.log(`  ${batchId}: ${result.rows[0].count} questions`);
    }

  } catch (error) {
    console.error('❌ Error assigning batches:', error);
    throw error;
  } finally {
    await client.end();
  }
}

assignBatchesToQuestions();
