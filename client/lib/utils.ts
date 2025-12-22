// Utility functions

import { ROLES, ROUTES, type UserRole } from './constants';
import process from "node:process";

/**
 * Get dashboard route based on user role
 */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case ROLES.USER:
      return ROUTES.DASHBOARD;
    case ROLES.HELPER:
      return ROUTES.HELPER_DASHBOARD;
    case ROLES.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    [ROLES.USER]: 1,
    [ROLES.HELPER]: 2,
    [ROLES.ADMIN]: 3,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get API URL - Only uses NEXT_PUBLIC_ prefixed env vars (safe for client)
 */
export function getApiUrl(): string {
  // Only use NEXT_PUBLIC_ prefixed variables (safe for client-side)
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }
  // Server-side can use regular env vars
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';
}

