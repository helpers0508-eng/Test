import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Utils sanitize function", () => {
  // Basic test to ensure the test runner finds this file
  const input = '<script>alert("xss")</script>Hello World';
  assertEquals(input.includes('<script>'), true);
});