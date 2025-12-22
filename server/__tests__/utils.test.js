const sanitize = require('../utils/sanitize');

describe('Utils Tests', () => {
  describe('sanitize', () => {
    it('should exist as a function', () => {
      expect(typeof sanitize).toBe('function');
    });

    it('should sanitize input strings', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = sanitize(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Hello World');
    });
  });
});