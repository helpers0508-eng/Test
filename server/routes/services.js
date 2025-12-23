import express from 'express';
import { _authenticateToken as authenticateToken, _requireRole as requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { category, search, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT id, name, description, category, price, duration, image, created_at
      FROM services
      WHERE is_active = TRUE
    `;
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const servicesResult = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM services WHERE is_active = TRUE';
    const countParams = [];
    let countParamCount = 1;

    if (category) {
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
      countParamCount++;
    }

    if (search) {
      countQuery += ` AND (name ILIKE $${countParamCount} OR description ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      services: servicesResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { id } = req.params;

    const serviceResult = await pool.query(`
      SELECT id, name, description, category, price, duration, image, created_at
      FROM services
      WHERE id = $1 AND is_active = TRUE
    `, [id]);

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Get available helpers for this service
    const helpersResult = await pool.query(`
      SELECT u.id, u.name, u.phone, u.address, hs.created_at as linked_at
      FROM users u
      JOIN helper_services hs ON u.id = hs.helper_id
      WHERE hs.service_id = $1 AND u.role = 'helper' AND u.is_active = TRUE
      ORDER BY hs.created_at DESC
    `, [id]);

    res.json({
      success: true,
      service: serviceResult.rows[0],
      availableHelpers: helpersResult.rows
    });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service'
    });
  }
});

// Get service categories
router.get('/meta/categories', async (req, res) => {
  try {
    const pool = req.app.get('pool');

    const categoriesResult = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM services
      WHERE is_active = TRUE
      GROUP BY category
      ORDER BY category
    `);

    res.json({
      success: true,
      categories: categoriesResult.rows
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Create service (Admin only)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, description, category, price, duration, image } = req.body;
    const pool = req.app.get('pool');

    const newService = await pool.query(`
      INSERT INTO services (name, description, category, price, duration, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, description, category, price, duration, image, created_at
    `, [name, description, category, price, duration, image]);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: newService.rows[0]
    });

  } catch (error) {
    console.error('Create service error:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(409).json({
        success: false,
        message: 'Service with this name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create service'
      });
    }
  }
});

// Update service (Admin only)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, duration, image, is_active } = req.body;
    const pool = req.app.get('pool');

    const updateResult = await pool.query(`
      UPDATE services
      SET name = $1, description = $2, category = $3, price = $4, duration = $5, image = $6, is_active = $7
      WHERE id = $8
      RETURNING id, name, description, category, price, duration, image, is_active, updated_at
    `, [name, description, category, price, duration, image, is_active, id]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      service: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
});

// Delete service (Admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.get('pool');

    // Check if service has active bookings
    const bookingCheck = await pool.query(`
      SELECT COUNT(*) FROM bookings
      WHERE service_id = $1 AND status IN ('pending', 'confirmed', 'in_progress')
    `, [id]);

    if (parseInt(bookingCheck.rows[0].count) > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete service with active bookings'
      });
    }

    const deleteResult = await pool.query(
      'DELETE FROM services WHERE id = $1',
      [id]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
});

export default router;