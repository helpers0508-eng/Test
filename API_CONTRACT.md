# Helpers Platform API Contract

## Overview
This document defines the complete API contract for the Helpers service platform. All endpoints follow RESTful conventions and use JSON for request/response bodies.

## Base URL
```
Production: https://api.helpers.com
Development: http://localhost:3001
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All responses follow this structure:
```json
{
  "success": boolean,
  "message": "string",
  "data": object|array|null,
  "pagination": object|null,
  "errors": array|null
}
```

## Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate/resource in use)
- `500` - Internal Server Error

---

## 1. Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "role": "user" // optional: "user" | "helper"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Validation Rules:**
- Email: Required, valid format, unique
- Password: Required, min 8 characters
- Name: Required, min 2 characters
- Phone: Optional, valid format
- Address: Optional
- Role: Optional, defaults to "user"

---

### POST /api/auth/verify-email
Verify email address with OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "is_verified": true,
    "created_at": "2024-01-15T10:00:00Z"
  },
  "token": "jwt_token_here"
}
```

---

### POST /api/auth/logout
Invalidate user session.

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### POST /api/auth/forgot-password
Request password reset OTP.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account with this email exists, a password reset link has been sent."
}
```

---

### POST /api/auth/reset-password
Reset password using OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### GET /api/auth/me
Get current user profile.

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "profile_image": null,
    "is_verified": true,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

---

## 2. User Management Endpoints

### GET /api/users/:userId
Get user profile by ID.

**Headers:** Authorization required
**Permissions:** Own profile or admin

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "profile_image": null,
    "is_verified": true,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

---

### PUT /api/users/:userId
Update user profile.

**Headers:** Authorization required
**Permissions:** Own profile or admin

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890",
  "address": "456 New St, City, State"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Smith",
    "phone": "+1234567890",
    "address": "456 New St, City, State",
    "updated_at": "2024-12-19T10:00:00Z"
  }
}
```

---

### POST /api/users/:userId/change-password
Change user password.

**Headers:** Authorization required
**Permissions:** Own profile or admin

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 3. Services Endpoints

### GET /api/services
Get all services with optional filtering.

**Query Parameters:**
- `category` (string): Filter by category
- `search` (string): Search in name/description
- `limit` (number): Results per page (default: 50)
- `offset` (number): Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "services": [
    {
      "id": 1,
      "name": "Home Cleaning",
      "description": "Professional cleaning service",
      "category": "cleaning",
      "price": 50.00,
      "duration": "2 hours",
      "image": "https://...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0
  }
}
```

---

### GET /api/services/:id
Get service details by ID.

**Response (200):**
```json
{
  "success": true,
  "service": {
    "id": 1,
    "name": "Home Cleaning",
    "description": "Professional cleaning service",
    "category": "cleaning",
    "price": 50.00,
    "duration": "2 hours",
    "image": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "availableHelpers": [
    {
      "id": 2,
      "name": "Jane Smith",
      "phone": "+1234567891"
    }
  ]
}
```

---

### GET /api/services/meta/categories
Get all service categories with counts.

**Response (200):**
```json
{
  "success": true,
  "categories": [
    {
      "category": "cleaning",
      "count": 5
    },
    {
      "category": "plumbing",
      "count": 3
    }
  ]
}
```

---

### POST /api/services
Create new service (Admin only).

**Headers:** Authorization required
**Permissions:** Admin only

**Request Body:**
```json
{
  "name": "New Service",
  "description": "Service description",
  "category": "cleaning",
  "price": 75.00,
  "duration": "1.5 hours",
  "image": "https://..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Service created successfully",
  "service": {
    "id": 7,
    "name": "New Service",
    "description": "Service description",
    "category": "cleaning",
    "price": 75.00,
    "duration": "1.5 hours",
    "image": "https://...",
    "created_at": "2024-12-19T10:00:00Z"
  }
}
```

---

### PUT /api/services/:id
Update service (Admin only).

**Headers:** Authorization required
**Permissions:** Admin only

**Request Body:**
```json
{
  "name": "Updated Service",
  "price": 80.00,
  "is_active": true
}
```

---

### DELETE /api/services/:id
Delete service (Admin only).

**Headers:** Authorization required
**Permissions:** Admin only

---

## 4. Bookings Endpoints

### GET /api/bookings
Get user's bookings.

**Headers:** Authorization required
**Query Parameters:**
- `status` (string): Filter by status
- `limit` (number): Results per page (default: 20)
- `offset` (number): Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "bookings": [
    {
      "id": 1,
      "bookingId": "BK001",
      "date": "2024-12-20",
      "time": "10:00 AM",
      "status": "confirmed",
      "price": 50.00,
      "address": "123 Main St",
      "notes": "Please bring supplies",
      "rating": null,
      "review": null,
      "createdAt": "2024-12-15T14:30:00Z",
      "service": {
        "id": 1,
        "name": "Home Cleaning",
        "category": "cleaning",
        "duration": "2 hours",
        "image": "https://..."
      },
      "helper": {
        "id": 2,
        "name": "Jane Smith",
        "phone": "+1234567891"
      }
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

---

### GET /api/bookings/:id
Get booking details by ID.

**Headers:** Authorization required
**Permissions:** Own booking or admin

---

### POST /api/bookings
Create new booking.

**Headers:** Authorization required

**Request Body:**
```json
{
  "serviceId": 1,
  "date": "2024-12-20",
  "time": "10:00",
  "address": "123 Main St, City, State",
  "notes": "Additional instructions"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "id": 1,
    "bookingId": "BK001",
    "date": "2024-12-20",
    "time": "10:00",
    "status": "pending",
    "price": 50.00,
    "address": "123 Main St, City, State",
    "notes": "Additional instructions",
    "created_at": "2024-12-19T10:00:00Z"
  }
}
```

---

### PUT /api/bookings/:id
Update booking.

**Headers:** Authorization required
**Permissions:** Own booking or admin

**Request Body:**
```json
{
  "date": "2024-12-21",
  "time": "11:00",
  "address": "New address",
  "notes": "Updated notes",
  "status": "confirmed" // Admin/helper only
}
```

---

### POST /api/bookings/:id/cancel
Cancel booking.

**Headers:** Authorization required
**Permissions:** Own booking or admin

**Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

---

### POST /api/bookings/:id/review
Add rating and review to completed booking.

**Headers:** Authorization required
**Permissions:** Own booking

**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent service!"
}
```

---

### GET /api/bookings/slots/:serviceId/:date
Get available time slots for service and date.

**Response (200):**
```json
{
  "success": true,
  "slots": [
    {
      "time": "09:00 AM",
      "available": true
    },
    {
      "time": "10:00 AM",
      "available": false
    }
  ]
}
```

---

## 5. Admin Endpoints

### GET /api/admin/stats
Get dashboard statistics.

**Headers:** Authorization required
**Permissions:** Admin only

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "total_users": 150,
    "total_helpers": 25,
    "total_bookings": 320,
    "completed_bookings": 280,
    "active_services": 12,
    "total_revenue": 18500.00
  }
}
```

---

### GET /api/admin/users
Get all users (Admin only).

**Headers:** Authorization required
**Permissions:** Admin only
**Query Parameters:** `role`, `limit`, `offset`

---

### PUT /api/admin/users/:userId/status
Update user active status (Admin only).

**Headers:** Authorization required
**Permissions:** Admin only

**Request Body:**
```json
{
  "is_active": false
}
```

---

### GET /api/admin/bookings
Get all bookings (Admin only).

**Headers:** Authorization required
**Permissions:** Admin only
**Query Parameters:** `status`, `limit`, `offset`

---

### PUT /api/admin/bookings/:bookingId/assign-helper
Assign helper to booking (Admin only).

**Headers:** Authorization required
**Permissions:** Admin only

**Request Body:**
```json
{
  "helperId": 2
}
```

---

### GET /api/admin/reports/revenue
Get revenue reports (Admin only).

**Headers:** Authorization required
**Permissions:** Admin only
**Query Parameters:** `start_date`, `end_date`

---

## 6. Health Check

### GET /api/health
Check API status.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

---

## Rate Limits
- General API: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per minute per IP

## Data Types
- **ID**: Integer (auto-increment)
- **Email**: String (unique, validated)
- **Password**: String (min 8 chars, hashed)
- **Price**: Decimal (10,2)
- **Date**: String (YYYY-MM-DD)
- **Time**: String (HH:MM)
- **Phone**: String (international format)
- **Boolean**: true/false
- **Timestamp**: ISO 8601 string

## Status Codes
- **User Status**: active, inactive
- **Booking Status**: pending, confirmed, in_progress, completed, cancelled
- **User Roles**: user, helper, admin

## File Upload
Future endpoints for profile images and service photos will use multipart/form-data.

## WebSocket
Future real-time features (notifications, chat) will use Socket.IO.

---
*This contract is version 1.0 and subject to change. All changes will be documented and versioned.*