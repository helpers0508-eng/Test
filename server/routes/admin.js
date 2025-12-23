import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply admin role requirement to all routes
router.use(authenticateToken, requireRole('admin'));

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const pool = req.app.get('pool');

    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'helper') as total_helpers,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as completed_bookings,
        (SELECT COUNT(*) FROM services WHERE is_active = TRUE) as active_services,
        (SELECT COALESCE(SUM(price), 0) FROM bookings WHERE status = 'completed') as total_revenue
    `);

    res.json({
      success: true,
      stats: stats.rows[0]
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { role, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT id, email, name, role, phone, address, is_verified, is_active, created_at
      FROM users
    `;
    const params = [];
    let paramCount = 1;

    if (role) {
      query += ` WHERE role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const usersResult = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users';
    const countParams = [];

    if (role) {
      countQuery += ' WHERE role = $1';
      countParams.push(role);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      users: usersResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Update user status
router.put('/users/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_active } = req.body;
    const pool = req.app.get('pool');

    const updateResult = await pool.query(`
      UPDATE users
      SET is_active = $1
      WHERE id = $2
      RETURNING id, email, name, role, is_active
    `, [is_active, userId]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      user: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { status, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT
        b.id, b.booking_id, b.date, b.time, b.status, b.price, b.address, b.created_at,
        u.id as user_id, u.name as user_name, u.email as user_email,
        s.id as service_id, s.name as service_name,
        h.id as helper_id, h.name as helper_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      LEFT JOIN users h ON b.helper_id = h.id
    `;

    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` WHERE b.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` ORDER BY b.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const bookingsResult = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM bookings b';
    const countParams = [];

    if (status) {
      countQuery += ' WHERE b.status = $1';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      bookings: bookingsResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// Assign helper to booking
router.put('/bookings/:bookingId/assign-helper', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { helperId } = req.body;
    const pool = req.app.get('pool');

    // Check if helper exists and is active
    const helperCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2 AND is_active = TRUE',
      [helperId, 'helper']
    );

    if (helperCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Helper not found or inactive'
      });
    }

    // Update booking
    const updateResult = await pool.query(`
      UPDATE bookings
      SET helper_id = $1, status = 'confirmed'
      WHERE id = $2
      RETURNING id, booking_id, status
    `, [helperId, bookingId]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Helper assigned successfully',
      booking: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Assign helper error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign helper'
    });
  }
});

// Get revenue reports
router.get('/reports/revenue', async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { start_date, end_date } = req.query;

    let query = `
      SELECT
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as bookings_count,
        COALESCE(SUM(price), 0) as revenue
      FROM bookings
      WHERE status = 'completed'
    `;

    const params = [];
    let paramCount = 1;

    if (start_date) {
      query += ` AND created_at >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND created_at <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }

    query += ` GROUP BY DATE_TRUNC('month', created_at) ORDER BY month DESC`;

    const revenueResult = await pool.query(query, params);

    res.json({
      success: true,
      reports: revenueResult.rows
    });

  } catch (error) {
    console.error('Get revenue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue report'
    });
  }
});

export default router;