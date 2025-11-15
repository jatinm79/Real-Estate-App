const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "realestate",
  password: process.env.DB_PASSWORD || "1245",
  port: process.env.DB_PORT || 5432,
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});


pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
  process.exit(-1);
});


const initDatabase = async () => {
  try {
    const client = await pool.connect();


    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        project_name VARCHAR(255) NOT NULL,
        builder_name VARCHAR(255) NOT NULL,
        location VARCHAR(500) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        description TEXT,
        main_image VARCHAR(500),
        bedrooms INTEGER,
        bathrooms INTEGER,
        area INTEGER,
        property_type VARCHAR(50),
        year_built INTEGER,
        parking INTEGER,
        floors INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    
    await client.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    
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
      CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
      CREATE INDEX IF NOT EXISTS idx_contact_inquiries_property_id ON contact_inquiries(property_id);
      CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
      CREATE INDEX IF NOT EXISTS idx_favorites_user_session ON favorites(user_session_id);
      CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id);
    `);

    console.log("✅ Database tables initialized successfully");
    client.release();
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
};

module.exports = { pool, initDatabase };
