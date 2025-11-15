import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, bedrooms, city } = req.query;
    
    let query = `
      SELECT *, 
      (SELECT COUNT(*) FROM favorites WHERE property_id = properties.id) as favorite_count
      FROM properties 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(type);
    }

    if (minPrice) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      params.push(parseFloat(maxPrice));
    }

    if (bedrooms) {
      paramCount++;
      query += ` AND bedrooms = $${paramCount}`;
      params.push(parseInt(bedrooms));
    }

    if (city) {
      paramCount++;
      query += ` AND city ILIKE $${paramCount}`;
      params.push(`%${city}%`);
    }

    query += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT *, 
      (SELECT COUNT(*) FROM favorites WHERE property_id = properties.id) as favorite_count
      FROM properties WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      bedrooms,
      bathrooms,
      sqft,
      address,
      city,
      state,
      zip_code,
      images = []
    } = req.body;

    if (!title || !price || !type || !address) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, price, type, address' 
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO properties 
      (title, description, price, type, bedrooms, bathrooms, sqft, address, city, state, zip_code, images) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [title, description, price, type, bedrooms, bathrooms, sqft, address, city, state, zip_code, images]
    );

    console.log('✅ Property created successfully:', rows[0].id);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('❌ Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = [];
    const values = [];
    let paramCount = 0;

    const fieldMapping = {
      project_name: 'title',
    };

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        paramCount++;
        const dbField = fieldMapping[key] || key;
        fields.push(`${dbField} = $${paramCount}`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    paramCount++;

    const query = `
      UPDATE properties 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

export default router;