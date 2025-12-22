const { authenticateToken, requireRole } = require('../middleware/auth');

describe('Auth Middleware Tests', () => {
  describe('authenticateToken', () => {
    it('should exist as a function', () => {
      expect(typeof authenticateToken).toBe('function');
    });
  });

  describe('requireRole', () => {
    it('should exist as a function', () => {
      expect(typeof requireRole).toBe('function');
    });
  });
});