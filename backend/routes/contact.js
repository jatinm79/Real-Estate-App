import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { property_id, name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, message' 
      });
    }

    if (property_id) {
      const propertyCheck = await pool.query('SELECT id FROM properties WHERE id = $1', [property_id]);
      if (propertyCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO contact_inquiries (property_id, name, email, phone, message) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [property_id || null, name, email, phone, message]
    );

    console.log('✅ Contact inquiry submitted:', rows[0].id);
    res.json({ 
      success: true, 
      message: 'Inquiry submitted successfully',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

export default router;