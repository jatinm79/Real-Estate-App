const { pool } = require('../config/database');

class Property {
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          p.*,
          COALESCE(
            json_agg(
              DISTINCT pi.image_url
            ) FILTER (WHERE pi.image_url IS NOT NULL),
            '[]'
          ) as gallery_images
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
      `;

      const whereConditions = [];
      const queryParams = [];
      let paramCount = 0;

      if (filters.location) {
        paramCount++;
        whereConditions.push(`p.location ILIKE $${paramCount}`);
        queryParams.push(`%${filters.location}%`);
      }

      if (filters.minPrice) {
        paramCount++;
        whereConditions.push(`p.price >= $${paramCount}`);
        queryParams.push(filters.minPrice);
      }

      if (filters.maxPrice) {
        paramCount++;
        whereConditions.push(`p.price <= $${paramCount}`);
        queryParams.push(filters.maxPrice);
      }

      if (filters.projectName) {
        paramCount++;
        whereConditions.push(`p.project_name ILIKE $${paramCount}`);
        queryParams.push(`%${filters.projectName}%`);
      }

      if (filters.propertyType) {
        paramCount++;
        whereConditions.push(`p.property_type = $${paramCount}`);
        queryParams.push(filters.propertyType);
      }

      if (filters.bedrooms) {
        paramCount++;
        whereConditions.push(`p.bedrooms >= $${paramCount}`);
        queryParams.push(filters.bedrooms);
      }

      if (filters.bathrooms) {
        paramCount++;
        whereConditions.push(`p.bathrooms >= $${paramCount}`);
        queryParams.push(filters.bathrooms);
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

      const result = await pool.query(query, queryParams);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching properties: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT 
          p.*,
          COALESCE(
            json_agg(
              DISTINCT pi.image_url
            ) FILTER (WHERE pi.image_url IS NOT NULL),
            '[]'
          ) as gallery_images
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
        WHERE p.id = $1
        GROUP BY p.id
      `;

      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching property: ${error.message}`);
    }
  }

  static async create(propertyData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const propertyQuery = `
        INSERT INTO properties (
          project_name, builder_name, location, price, description, 
          main_image, bedrooms, bathrooms, area, property_type, year_built, parking, floors
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;
      
      const propertyValues = [
        propertyData.project_name,
        propertyData.builder_name,
        propertyData.location,
        propertyData.price,
        propertyData.description,
        propertyData.main_image,
        propertyData.bedrooms || null,
        propertyData.bathrooms || null,
        propertyData.area || null,
        propertyData.property_type || null,
        propertyData.year_built || null,
        propertyData.parking || null,
        propertyData.floors || null
      ];

      console.log('Creating property with values:', propertyValues);

      const propertyResult = await client.query(propertyQuery, propertyValues);
      const newProperty = propertyResult.rows[0];

      if (propertyData.gallery_images && propertyData.gallery_images.length > 0) {
        const imageQueries = propertyData.gallery_images.map(imageUrl => 
          client.query(
            'INSERT INTO property_images (property_id, image_url) VALUES ($1, $2)',
            [newProperty.id, imageUrl]
          )
        );
        
        await Promise.all(imageQueries);
      }

      await client.query('COMMIT');
      
      const completeProperty = await this.findById(newProperty.id);
      return completeProperty;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in Property.create:', error);
      throw new Error(`Error creating property: ${error.message}`);
    } finally {
      client.release();
    }
  }

  static async update(id, propertyData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const updateFields = [];
      const updateValues = [];
      let paramCount = 0;

      const fields = [
        'project_name', 'builder_name', 'location', 'price', 'description', 'main_image',
        'bedrooms', 'bathrooms', 'area', 'property_type', 'year_built', 'parking', 'floors'
      ];
      
      fields.forEach(field => {
        if (propertyData[field] !== undefined) {
          paramCount++;
          updateFields.push(`${field} = $${paramCount}`);
          updateValues.push(propertyData[field]);
        }
      });

      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }

      paramCount++;
      updateValues.push(id);

      const updateQuery = `
        UPDATE properties 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const updateResult = await client.query(updateQuery, updateValues);
      
      if (updateResult.rows.length === 0) {
        throw new Error('Property not found');
      }

      if (propertyData.gallery_images !== undefined) {
        await client.query('DELETE FROM property_images WHERE property_id = $1', [id]);

        if (propertyData.gallery_images.length > 0) {
          const imageQueries = propertyData.gallery_images.map(imageUrl =>
            client.query(
              'INSERT INTO property_images (property_id, image_url) VALUES ($1, $2)',
              [id, imageUrl]
            )
          );
          
          await Promise.all(imageQueries);
        }
      }

      await client.query('COMMIT');
      
      const updatedProperty = await this.findById(id);
      return updatedProperty;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error updating property: ${error.message}`);
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM properties WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Property not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting property: ${error.message}`);
    }
  }
}

module.exports = Property;