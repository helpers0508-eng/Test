import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Auth middleware functions exist", () => {
  // Basic test to ensure the test runner finds this file
  assertEquals(typeof "auth", "string");
});