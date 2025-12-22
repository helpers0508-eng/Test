const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get availability slots for a helper
router.get('/helper/:helperId', async (req, res) => {
  try {
    const { helperId } = req.params;
    const { date } = req.query;
    const pool = req.app.get('pool');

    let query = `
      SELECT * FROM availability_slots
      WHERE helper_id = $1
    `;
    let params = [helperId];

    if (date) {
      query += ' AND date = $2';
      params.push(date);
    }

    query += ' ORDER BY date, start_time';

    const slots = await pool.query(query, params);

    res.json({
      success: true,
      data: slots.rows
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability'
    });
  }
});

// Create availability slot (helper only)
router.post('/', authenticateToken, requireRole('helper'), [
  body('date').isISO8601(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
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

    const { date, startTime, endTime } = req.body;
    const helperId = req.user.id;
    const pool = req.app.get('pool');

    // Check for conflicts
    const conflict = await pool.query(`
      SELECT id FROM availability_slots
      WHERE helper_id = $1 AND date = $2 AND (
        (start_time <= $3 AND end_time > $3) OR
        (start_time < $4 AND end_time >= $4) OR
        (start_time >= $3 AND end_time <= $4)
      )
    `, [helperId, date, startTime, endTime]);

    if (conflict.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Time slot conflicts with existing availability'
      });
    }

    // Create slot
    const slot = await pool.query(`
      INSERT INTO availability_slots (helper_id, date, start_time, end_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [helperId, date, startTime, endTime]);

    res.status(201).json({
      success: true,
      data: slot.rows[0],
      message: 'Availability slot created successfully'
    });
  } catch (error) {
    console.error('Error creating availability slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create availability slot'
    });
  }
});

// Update availability slot
router.put('/:slotId', authenticateToken, requireRole('helper'), [
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('isAvailable').optional().isBoolean()
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

    const { slotId } = req.params;
    const { startTime, endTime, isAvailable } = req.body;
    const helperId = req.user.id;
    const pool = req.app.get('pool');

    // Check ownership
    const slot = await pool.query(`
      SELECT * FROM availability_slots WHERE id = $1 AND helper_id = $2
    `, [slotId, helperId]);

    if (slot.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Availability slot not found'
      });
    }

    // Update slot
    const updatedSlot = await pool.query(`
      UPDATE availability_slots
      SET start_time = COALESCE($1, start_time),
          end_time = COALESCE($2, end_time),
          is_available = COALESCE($3, is_available),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [startTime, endTime, isAvailable, slotId]);

    res.json({
      success: true,
      data: updatedSlot.rows[0],
      message: 'Availability slot updated successfully'
    });
  } catch (error) {
    console.error('Error updating availability slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability slot'
    });
  }
});

// Delete availability slot
router.delete('/:slotId', authenticateToken, requireRole('helper'), async (req, res) => {
  try {
    const { slotId } = req.params;
    const helperId = req.user.id;
    const pool = req.app.get('pool');

    const result = await pool.query(`
      DELETE FROM availability_slots WHERE id = $1 AND helper_id = $2
    `, [slotId, helperId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Availability slot not found'
      });
    }

    res.json({
      success: true,
      message: 'Availability slot deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting availability slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete availability slot'
    });
  }
});

// Get available slots for booking (public)
router.get('/available/:serviceId/:date', async (req, res) => {
  try {
    const { serviceId, date } = req.params;
    const pool = req.app.get('pool');

    // Get helpers for this service
    const helpers = await pool.query(`
      SELECT DISTINCT u.id, u.name
      FROM users u
      JOIN helper_services hs ON u.id = hs.helper_id
      WHERE u.role = 'helper' AND hs.service_id = $1 AND hs.is_active = true
    `, [serviceId]);

    const availableSlots = [];

    for (const helper of helpers.rows) {
      // Get available slots for this helper on the date
      const slots = await pool.query(`
        SELECT * FROM availability_slots
        WHERE helper_id = $1 AND date = $2 AND is_available = true
        ORDER BY start_time
      `, [helper.id, date]);

      // Check for existing bookings
      for (const slot of slots.rows) {
        const booking = await pool.query(`
          SELECT id FROM bookings
          WHERE helper_id = $1 AND date = $2 AND time >= $3 AND time < $4
          AND status NOT IN ('cancelled')
        `, [helper.id, date, slot.start_time, slot.end_time]);

        if (booking.rows.length === 0) {
          availableSlots.push({
            helperId: helper.id,
            helperName: helper.name,
            date: slot.date,
            startTime: slot.start_time,
            endTime: slot.end_time
          });
        }
      }
    }

    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots'
    });
  }
});

module.exports = router;