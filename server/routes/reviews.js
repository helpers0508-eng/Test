const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get reviews for a user (as reviewee)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = req.app.get('pool');

    const reviews = await pool.query(`
      SELECT r.*, b.booking_id, u.name as reviewer_name
      FROM reviews r
      JOIN bookings b ON r.booking_id = b.id
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.reviewee_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      data: reviews.rows
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Create a review (after booking completion)
router.post('/', authenticateToken, [
  body('bookingId').isInt(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 1000 })
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

    const { bookingId, rating, comment } = req.body;
    const userId = req.user.id;
    const pool = req.app.get('pool');

    // Check if booking exists and user is the one who booked
    const booking = await pool.query(`
      SELECT * FROM bookings WHERE id = $1 AND user_id = $2 AND status = 'completed'
    `, [bookingId, userId]);

    if (booking.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not eligible for review'
      });
    }

    // Check if review already exists
    const existingReview = await pool.query(`
      SELECT id FROM reviews WHERE booking_id = $1
    `, [bookingId]);

    if (existingReview.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this booking'
      });
    }

    // Create review
    const review = await pool.query(`
      INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [bookingId, userId, booking.rows[0].helper_id, rating, comment]);

    res.status(201).json({
      success: true,
      data: review.rows[0],
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
});

// Update review
router.put('/:reviewId', authenticateToken, [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 1000 })
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

    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const pool = req.app.get('pool');

    // Check if review exists and user is the reviewer
    const review = await pool.query(`
      SELECT * FROM reviews WHERE id = $1 AND reviewer_id = $2
    `, [reviewId, userId]);

    if (review.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update review
    const updatedReview = await pool.query(`
      UPDATE reviews
      SET rating = COALESCE($1, rating),
          comment = COALESCE($2, comment),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [rating, comment, reviewId]);

    res.json({
      success: true,
      data: updatedReview.rows[0],
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
});

// Delete review (admin only)
router.delete('/:reviewId', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { reviewId } = req.params;
    const pool = req.app.get('pool');

    const result = await pool.query(`
      DELETE FROM reviews WHERE id = $1
    `, [reviewId]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

module.exports = router;