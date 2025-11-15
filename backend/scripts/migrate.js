const { pool } = require('../config/database');

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migration...');
    
    await client.query('BEGIN');

    await client.query(`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS bedrooms INTEGER,
      ADD COLUMN IF NOT EXISTS bathrooms INTEGER,
      ADD COLUMN IF NOT EXISTS area INTEGER,
      ADD COLUMN IF NOT EXISTS property_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS year_built INTEGER,
      ADD COLUMN IF NOT EXISTS parking INTEGER,
      ADD COLUMN IF NOT EXISTS floors INTEGER;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_session_id VARCHAR(255) NOT NULL,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_session_id, property_id)
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
      CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
      CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
      CREATE INDEX IF NOT EXISTS idx_contact_inquiries_property_id ON contact_inquiries(property_id);
      CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
      CREATE INDEX IF NOT EXISTS idx_favorites_user_session ON favorites(user_session_id);
      CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id);
    `);

    await client.query('COMMIT');
    console.log('Database migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    process.exit();
  }
}

runMigration();