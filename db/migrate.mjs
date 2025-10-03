import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...\n');
    
    // Connect to database
    await client.connect();
    console.log('✅ Connected to Neon database\n');
    
    // Read the SQL file
    const schemaPath = path.join(__dirname, 'complete-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Executing complete schema...\n');
    
    try {
      // Execute the entire schema
      await client.query(schema);
      console.log('✅ Schema executed successfully!\n');
    } catch (error) {
      console.error('❌ Error executing schema:');
      console.error(error.message);
      throw error;
    }
    
    console.log('📊 Verifying tables...');
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Created tables:');
    result.rows.forEach(t => console.log(`  - ${t.table_name}`));
    
    console.log(`\n✅ Total: ${result.rows.length} tables created`);
    
    await client.end();
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    await client.end();
    process.exit(1);
  }
}

runMigration();
