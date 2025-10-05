# Question Batch System Documentation

## Overview
The question batch system has been refactored to use unique, explicit batch IDs instead of dynamic braiding logic. This makes the system easier to understand, maintain, and debug.

## Batch Structure

### 4 Unique Batches

Each batch has a unique ID that clearly describes its composition:

1. **`batch-a-s1-first-s2-first`** (BATCH_A_SET1_FIRST_SET2_FIRST)
   - Uses first 3 cards from Set 1 and Set 2
   - Pattern: S1-Card1, S2-Card1, S1-Card2, S2-Card2, S1-Card3, S2-Card3

2. **`batch-b-s2-first-s1-first`** (BATCH_B_SET2_FIRST_SET1_FIRST)
   - Uses first 3 cards from Set 2 and Set 1 (flipped)
   - Pattern: S2-Card1, S1-Card1, S2-Card2, S1-Card2, S2-Card3, S1-Card3

3. **`batch-c-s1-second-s2-second`** (BATCH_C_SET1_SECOND_SET2_SECOND)
   - Uses last 3 cards from Set 1 and Set 2
   - Pattern: S1-Card4, S2-Card4, S1-Card5, S2-Card5, S1-Card6, S2-Card6

4. **`batch-d-s2-second-s1-second`** (BATCH_D_SET2_SECOND_SET1_SECOND)
   - Uses last 3 cards from Set 2 and Set 1 (flipped)
   - Pattern: S2-Card4, S1-Card4, S2-Card5, S1-Card5, S2-Card6, S1-Card6

## Question IDs by Batch

### Batch A: `batch-a-s1-first-s2-first`
```
1. 550e8400-e29b-41d4-a716-446655440010 (Set 1, Card 1)
2. 550e8400-e29b-41d4-a716-446655440020 (Set 2, Card 1)
3. 550e8400-e29b-41d4-a716-446655440011 (Set 1, Card 2)
4. 550e8400-e29b-41d4-a716-446655440021 (Set 2, Card 2)
5. 550e8400-e29b-41d4-a716-446655440012 (Set 1, Card 3)
6. 550e8400-e29b-41d4-a716-446655440022 (Set 2, Card 3)
```

### Batch B: `batch-b-s2-first-s1-first`
```
1. 550e8400-e29b-41d4-a716-446655440020 (Set 2, Card 1)
2. 550e8400-e29b-41d4-a716-446655440010 (Set 1, Card 1)
3. 550e8400-e29b-41d4-a716-446655440021 (Set 2, Card 2)
4. 550e8400-e29b-41d4-a716-446655440011 (Set 1, Card 2)
5. 550e8400-e29b-41d4-a716-446655440022 (Set 2, Card 3)
6. 550e8400-e29b-41d4-a716-446655440012 (Set 1, Card 3)
```

### Batch C: `batch-c-s1-second-s2-second`
```
1. 550e8400-e29b-41d4-a716-446655440013 (Set 1, Card 4)
2. 550e8400-e29b-41d4-a716-446655440023 (Set 2, Card 4)
3. 550e8400-e29b-41d4-a716-446655440014 (Set 1, Card 5)
4. 550e8400-e29b-41d4-a716-446655440024 (Set 2, Card 5)
5. 550e8400-e29b-41d4-a716-446655440015 (Set 1, Card 6)
6. 550e8400-e29b-41d4-a716-446655440025 (Set 2, Card 6)
```

### Batch D: `batch-d-s2-second-s1-second`
```
1. 550e8400-e29b-41d4-a716-446655440023 (Set 2, Card 4)
2. 550e8400-e29b-41d4-a716-446655440013 (Set 1, Card 4)
3. 550e8400-e29b-41d4-a716-446655440024 (Set 2, Card 5)
4. 550e8400-e29b-41d4-a716-446655440014 (Set 1, Card 5)
5. 550e8400-e29b-41d4-a716-446655440025 (Set 2, Card 6)
6. 550e8400-e29b-41d4-a716-446655440015 (Set 1, Card 6)
```

## How It Works

1. **Batch Selection**: On each API call, one of the 4 batches is randomly selected
2. **Question Retrieval**: The specific question IDs for that batch are used to fetch the exact questions in the exact order
3. **No Dynamic Logic**: No more set filtering, sorting, or index-based braiding - just direct ID lookup
4. **Clear Tracking**: Each batch has a descriptive ID that appears in logs for easy debugging

## Benefits

✅ **Explicit & Clear**: Each batch is defined with exact question IDs - no ambiguity
✅ **Easy to Debug**: Batch IDs in logs make it obvious which questions should appear
✅ **Easy to Extend**: Adding new batches is as simple as adding new entries to the BATCH_IDS and BATCHES objects
✅ **No Complex Logic**: Removed all set filtering, sorting, and loop-based braiding
✅ **Type-Safe**: TypeScript can validate the structure at compile time

## Logging

The system logs 3 key pieces of information:
1. `Selected Batch: [batch-id]` - Which batch was chosen
2. `Question IDs: [id1, id2, ...]` - The exact question IDs in order
3. `Found X questions for batch [batch-id]` - Confirmation of successful retrieval

## Future Expansion

To add more batches:
1. Add new entry to `BATCH_IDS` object with descriptive key and unique ID
2. Add corresponding entry to `BATCHES` object with question IDs array
3. That's it! The random selection will automatically include the new batch

Example:
```typescript
const BATCH_IDS = {
  // ... existing batches
  'BATCH_E_SET1_ALL': 'batch-e-s1-all',
}

const BATCHES = {
  // ... existing batches
  [BATCH_IDS.BATCH_E_SET1_ALL]: [
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440014',
    '550e8400-e29b-41d4-a716-446655440015',
  ]
}
```

## Database Requirements

- Each question must have a unique `question_id` UUID
- Questions maintain their `set_id` and `card_number` for reference
- The system queries all questions but only uses those in the selected batch

---

**Last Updated**: User refactor to unique batch IDs system
**Location**: `app/api/questions/route.ts`
