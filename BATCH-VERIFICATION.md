# Batch System Verification Guide

## ✅ YES! The UI is fetching from database batches

### How to Verify:

1. **Start dev server**: `npm run dev`

2. **Navigate to**: `http://localhost:3000/inked`

3. **Open browser console** and look for:
   ```
   🎲 ========================================
   [QUESTIONS API] Selected Batch: batch-a-s1-first-s2-first
   🎲 ========================================
   
   [QUESTIONS API] Found 6 questions for batch batch-a-s1-first-s2-first
   [QUESTIONS API] Question order: Set1-Card1, Set2-Card1, Set1-Card2, Set2-Card2, Set1-Card3, Set2-Card3
   
   📊 Batch Details:
     Position 1: [Question from Set 1, Card 1]
     Position 2: [Question from Set 2, Card 1]
     Position 3: [Question from Set 1, Card 2]
     Position 4: [Question from Set 2, Card 2]
     Position 5: [Question from Set 1, Card 3]
     Position 6: [Question from Set 2, Card 3]
   ```

4. **Refresh the page** multiple times - you should see different batches selected randomly:
   - `batch-a-s1-first-s2-first`
   - `batch-b-s2-first-s1-first`
   - `batch-c-s1-second-s2-second`
   - `batch-d-s2-second-s1-second`

### What Each Batch Means:

| Batch ID | Description | Question Order |
|----------|-------------|----------------|
| **batch-a-s1-first-s2-first** | First half of both sets, Set 1 leads | S1-1, S2-1, S1-2, S2-2, S1-3, S2-3 |
| **batch-b-s2-first-s1-first** | First half of both sets, Set 2 leads | S2-1, S1-1, S2-2, S1-2, S2-3, S1-3 |
| **batch-c-s1-second-s2-second** | Second half of both sets, Set 1 leads | S1-4, S2-4, S1-5, S2-5, S1-6, S2-6 |
| **batch-d-s2-second-s1-second** | Second half of both sets, Set 2 leads | S2-4, S1-4, S2-5, S1-5, S2-6, S1-6 |

### Database Verification:

Check the `batch_assignments` table:
```sql
-- See all batch assignments
SELECT 
  ba.batch_id,
  ba.position,
  q.set_id,
  q.card_number,
  q.page_headline
FROM batch_assignments ba
JOIN questions q ON ba.question_id = q.question_id
ORDER BY ba.batch_id, ba.position;

-- Count questions per batch (should be 6 each)
SELECT batch_id, COUNT(*) as question_count
FROM batch_assignments
GROUP BY batch_id;
```

Expected result:
```
batch_id                        | question_count
--------------------------------|---------------
batch-a-s1-first-s2-first      | 6
batch-b-s2-first-s1-first      | 6
batch-c-s1-second-s2-second    | 6
batch-d-s2-second-s1-second    | 6
```

## 🎯 Key Points:

1. ✅ **NO HARDCODED QUESTIONS** - Everything pulls from database
2. ✅ **BATCH IDS IN DATABASE** - Stored in `batch_assignments` table
3. ✅ **RANDOM SELECTION** - API randomly picks 1 of 4 batches per page load
4. ✅ **PROPER ORDERING** - Questions returned in exact `position` order from database
5. ✅ **BRAIDED PATTERN** - Each batch alternates between Set 1 and Set 2 questions

## 🔄 Future Expansion:

To add more batches (e.g., Batch E, F, G):
1. Run `node db/assign-batch-ids.js` with new batch logic
2. Add new batch IDs to `BATCH_IDS` array in `/app/api/questions/route.ts`
3. That's it! The random selection automatically includes new batches

## 📝 Summary:

**YES, the UI is 100% fetching from database batches!**
- Frontend calls `/api/questions`
- API queries `batch_assignments` table
- Returns 6 questions in braided order
- Each page load has 25% chance of each batch
- Zero hardcoded data ✅
