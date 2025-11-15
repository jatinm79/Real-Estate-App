import pool from './database.js';

const setupDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(12,2) NOT NULL,
        type VARCHAR(50) NOT NULL,
        bedrooms INTEGER,
        bathrooms INTEGER,
        sqft INTEGER,
        address TEXT NOT NULL,
        city VARCHAR(100),
        state VARCHAR(50),
        zip_code VARCHAR(20),
        images TEXT[],
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        property_id INTEGER REFERENCES properties(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, property_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully');

    await insertSampleData();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
};

const insertSampleData = async () => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM properties');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO properties (title, description, price, type, bedrooms, bathrooms, sqft, address, city, state, zip_code, images) 
        VALUES 
        ('Modern Downtown Apartment', 'Beautiful modern apartment with great city views', 350000, 'apartment', 2, 2, 1200, '123 Main St', 'Pune', 'India', '10001', ARRAY['/images/property1.jpg']),
        ('Suburban Family Home', 'Spacious family home in quiet neighborhood', 550000, 'house', 4, 3, 2400, '456 Oak Ave', 'Jaipur', 'Inida', '02115', ARRAY['/images/property2.jpg']),
        ('Luxury Condo', 'Luxury condo with amazing amenities', 750000, 'condo', 3, 2, 1800, '789 Park Blvd', 'Chicago', 'IL', '60601', ARRAY['/images/property3.jpg'])
      `);
      console.log('✅ Sample data inserted successfully');
    }
  } catch (error) {
    console.error('❌ Sample data insertion failed:', error);
  }
};

export default setupDatabase;