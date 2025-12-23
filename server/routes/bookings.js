import express from 'express';
import { body, validationResult } from 'express-validator';
import { _authenticateToken as authenticateToken, _requireRole as requireRole, _requireOwnershipOrAdmin as requireOwnershipOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get user's bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { status, limit = 20, offset = 0 } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT
        b.id, b.booking_id, b.date, b.time, b.status, b.price, b.address, b.notes,
        b.rating, b.review, b.created_at,
        s.id as service_id, s.name as service_name, s.description as service_description,
        s.category as service_category, s.duration as service_duration, s.image as service_image,
        h.id as helper_id, h.name as helper_name, h.phone as helper_phone
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN users h ON b.helper_id = h.id
      WHERE b.user_id = $1
    `;

    const params = [userId];
    let paramCount = 2;

    if (status) {
      query += ` AND b.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` ORDER BY b.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const bookingsResult = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM bookings WHERE user_id = $1';
    const countParams = [userId];

    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);

    const bookings = bookingsResult.rows.map(booking => ({
      id: booking.id,
      bookingId: booking.booking_id,
      date: booking.date,
      time: booking.time,
      status: booking.status,
      price: parseFloat(booking.price),
      address: booking.address,
      notes: booking.notes,
      rating: booking.rating,
      review: booking.review,
      createdAt: booking.created_at,
      service: {
        id: booking.service_id,
        name: booking.service_name,
        description: booking.service_description,
        category: booking.service_category,
        duration: booking.service_duration,
        image: booking.service_image
      },
      helper: booking.helper_id ? {
        id: booking.helper_id,
        name: booking.helper_name,
        phone: booking.helper_phone
      } : null
    }));

    res.json({
      success: true,
      bookings,
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

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const { id } = req.params;
    const userId = req.user.id;

    const bookingResult = await pool.query(`
      SELECT
        b.id, b.booking_id, b.date, b.time, b.status, b.price, b.address, b.notes,
        b.rating, b.review, b.created_at, b.updated_at,
        s.id as service_id, s.name as service_name, s.description as service_description,
        s.category as service_category, s.duration as service_duration, s.image as service_image,
        h.id as helper_id, h.name as helper_name, h.phone as helper_phone, h.email as helper_email
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN users h ON b.helper_id = h.id
      WHERE b.id = $1 AND (b.user_id = $2 OR $3 = 'admin')
    `, [id, userId, req.user.role]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookingResult.rows[0];
    const bookingData = {
      id: booking.id,
      bookingId: booking.booking_id,
      date: booking.date,
      time: booking.time,
      status: booking.status,
      price: parseFloat(booking.price),
      address: booking.address,
      notes: booking.notes,
      rating: booking.rating,
      review: booking.review,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
      service: {
        id: booking.service_id,
        name: booking.service_name,
        description: booking.service_description,
        category: booking.service_category,
        duration: booking.service_duration,
        image: booking.service_image
      },
      helper: booking.helper_id ? {
        id: booking.helper_id,
        name: booking.helper_name,
        phone: booking.helper_phone,
        email: booking.helper_email
      } : null
    };

    res.json({
      success: true,
      booking: bookingData
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
});

// Create booking
router.post('/', authenticateToken, [
  body('serviceId').isInt({ min: 1 }),
  body('date').isISO8601(),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('address').optional().trim().isLength({ min: 10 }),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { serviceId, date, time, address, notes } = req.body;
    const userId = req.user.id;
    const pool = req.app.get('pool');

    // Check if service exists and is active
    const serviceResult = await pool.query(
      'SELECT id, price FROM services WHERE id = $1 AND is_active = TRUE',
      [serviceId]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or unavailable'
      });
    }

    const service = serviceResult.rows[0];

    // Check if user already has a booking at this time
    const conflictCheck = await pool.query(`
      SELECT id FROM bookings
      WHERE user_id = $1 AND date = $2 AND time = $3 AND status IN ('pending', 'confirmed', 'in_progress')
    `, [userId, date, time]);

    if (conflictCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You already have a booking at this time'
      });
    }

    // Generate booking ID
    const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create booking
    const newBooking = await pool.query(`
      INSERT INTO bookings (booking_id, user_id, service_id, date, time, price, address, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, booking_id, date, time, status, price, address, notes, created_at
    `, [bookingId, userId, serviceId, date, time, service.price, address, notes]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: newBooking.rows[0]
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  }
});

// Update booking
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, address, notes, status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const pool = req.app.get('pool');

    // Check ownership or admin access
    const ownershipCheck = await pool.query(
      'SELECT user_id FROM bookings WHERE id = $1',
      [id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (ownershipCheck.rows[0].user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow status updates by admin/helpers
    const updateFields = [];
    const params = [id];
    let paramCount = 2;

    if (date) {
      updateFields.push(`date = $${paramCount}`);
      params.push(date);
      paramCount++;
    }

    if (time) {
      updateFields.push(`time = $${paramCount}`);
      params.push(time);
      paramCount++;
    }

    if (address) {
      updateFields.push(`address = $${paramCount}`);
      params.push(address);
      paramCount++;
    }

    if (notes !== undefined) {
      updateFields.push(`notes = $${paramCount}`);
      params.push(notes);
      paramCount++;
    }

    // Status updates (admin/helper only)
    if (status && (userRole === 'admin' || userRole === 'helper')) {
      const allowedStatuses = ['confirmed', 'in_progress', 'completed', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }
      updateFields.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const updateQuery = `
      UPDATE bookings
      SET ${updateFields.join(', ')}
      WHERE id = $1
      RETURNING id, booking_id, date, time, status, price, address, notes, updated_at
    `;

    const updateResult = await pool.query(updateQuery, params);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking'
    });
  }
});

// Cancel booking
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const pool = req.app.get('pool');

    // Check ownership or admin access
    const ownershipCheck = await pool.query(
      'SELECT user_id, status FROM bookings WHERE id = $1',
      [id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = ownershipCheck.rows[0];

    if (booking.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this stage'
      });
    }

    // Update status to cancelled
    await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2',
      ['cancelled', id]
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
});

// Rate and review booking
router.post('/:id/review', authenticateToken, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('review').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;
    const pool = req.app.get('pool');

    // Check ownership and booking status
    const bookingCheck = await pool.query(`
      SELECT status FROM bookings
      WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (bookingCheck.rows[0].status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Update booking with rating and review
    await pool.query(`
      UPDATE bookings
      SET rating = $1, review = $2
      WHERE id = $3
    `, [rating, review, id]);

    res.json({
      success: true,
      message: 'Review submitted successfully'
    });

  } catch (error) {
    console.error('Review booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
});

// Get available time slots for a service and date
router.get('/slots/:serviceId/:date', async (req, res) => {
  try {
    const { serviceId, date } = req.params;
    const pool = req.app.get('pool');

    // Get all possible time slots (9 AM to 5 PM, every hour)
    const allSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      allSlots.push({ time, available: true });
    }

    // Check booked slots
    const bookedSlots = await pool.query(`
      SELECT time FROM bookings
      WHERE service_id = $1 AND date = $2 AND status IN ('pending', 'confirmed', 'in_progress')
    `, [serviceId, date]);

    const bookedTimes = bookedSlots.rows.map(row => row.time);

    // Mark unavailable slots
    const availableSlots = allSlots.map(slot => ({
      ...slot,
      available: !bookedTimes.includes(slot.time)
    }));

    res.json({
      success: true,
      slots: availableSlots
    });

  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots'
    });
  }
});

export default router;