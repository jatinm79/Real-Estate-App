import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { user_session_id } = req.query;
    
    if (!user_session_id) {
      return res.status(400).json({ error: 'User session ID is required' });
    }

    const { rows } = await pool.query(
      `SELECT p.* FROM properties p
       JOIN favorites f ON p.id = f.property_id
       WHERE f.user_session_id = $1
       ORDER BY f.created_at DESC`,
      [user_session_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { property_id, user_session_id } = req.body;

    if (!property_id || !user_session_id) {
      return res.status(400).json({ error: 'Property ID and User Session ID are required' });
    }

    const propertyCheck = await pool.query('SELECT id FROM properties WHERE id = $1', [property_id]);
    if (propertyCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await pool.query(
      `INSERT INTO favorites (user_session_id, property_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_session_id, property_id) DO NOTHING
       RETURNING *`,
      [user_session_id, property_id]
    );

    res.json({ 
      success: true, 
      message: 'Added to favorites',
      data: { is_favorited: true }
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

router.delete('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { user_session_id } = req.body;

    if (!user_session_id) {
      return res.status(400).json({ error: 'User session ID is required' });
    }

    const { rowCount } = await pool.query(
      'DELETE FROM favorites WHERE user_session_id = $1 AND property_id = $2',
      [user_session_id, propertyId]
    );

    res.json({ 
      success: true, 
      message: 'Removed from favorites',
      data: { is_favorited: false }
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

router.get('/check/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { user_session_id } = req.query;

    if (!user_session_id) {
      return res.status(400).json({ error: 'User session ID is required' });
    }

    const { rows } = await pool.query(
      'SELECT 1 FROM favorites WHERE user_session_id = $1 AND property_id = $2',
      [user_session_id, propertyId]
    );

    res.json({ 
      data: { 
        is_favorited: rows.length > 0 
      } 
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ error: 'Failed to check favorite' });
  }
});

export default router;