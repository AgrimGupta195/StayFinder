# StayFinder
# StayFinder Backend

This is the backend API for StayFinder, a property listing and booking platform.

---

## Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Listing Routes](#listing-routes)
  - [Booking Routes](#booking-routes)
- [Payloads](#payloads)
- [Authentication](#authentication)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

---

## Setup

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```

2. **Configure environment variables:**  
   Create a `.env` file in the backend directory (see below).

3. **Start the server:**
   ```sh
   node server.js
   ```

---

## Environment Variables

Your `.env` file should look like:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

---

## API Endpoints

### User Routes (`/api/users`)

| Method | Endpoint           | Description                | Auth Required |
|--------|--------------------|----------------------------|--------------|
| POST   | `/register`        | Register a new user        | No           |
| POST   | `/login`           | Login user                 | No           |
| POST   | `/logout`          | Logout user                | Yes          |
| GET    | `/profile`         | Get current user profile   | Yes          |
| PUT    | `/profile`         | Update user profile        | Yes          |

---

### Listing Routes (`/api/listings`)

| Method | Endpoint           | Description                        | Auth Required |
|--------|--------------------|------------------------------------|--------------|
| GET    | `/`                | Get all listings                   | No           |
| POST   | `/`                | Create a new listing (host only)   | Yes          |
| GET    | `/:id`             | Get listing by ID                  | No           |
| PUT    | `/:id`             | Update listing (host only)         | Yes          |
| DELETE | `/:id`             | Delete listing (host only)         | Yes          |

---

### Booking Routes (`/api/bookings`)

| Method | Endpoint           | Description                        | Auth Required |
|--------|--------------------|------------------------------------|--------------|
| GET    | `/`                | Get all bookings for user/host     | Yes          |
| POST   | `/`                | Create a new booking               | Yes          |
| GET    | `/:id`             | Get booking by ID                  | Yes          |
| DELETE | `/:id`             | Cancel booking                     | Yes          |

---

## Payloads

### User Routes

#### **POST `/api/users/register`**
Register a new user.

**Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword",
  "role": "user" // or "host"
}
```
- `name` (string, required)
- `email` (string, required, must be unique)
- `password` (string, required)
- `role` (string, optional: "user" or "host", default: "user")

---

#### **POST `/api/users/login`**
Login user.

**Payload:**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```
- `email` (string, required)
- `password` (string, required)

---

#### **PUT `/api/users/profile`**
Update user profile.

**Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "newpassword" // optional
}
```
- `name` (string, optional)
- `email` (string, optional)
- `password` (string, optional)

---

### Listing Routes

#### **POST `/api/listings`**
Create a new listing (host only).

**Payload:**
```json
{
  "title": "Cozy Apartment",
  "description": "A nice place to stay.",
  "address": "123 Main St, City",
  "price": 100,
  "images": ["image_url_1", "image_url_2"],
  "amenities": ["wifi", "parking"],
  "availableFrom": "2025-06-15",
  "availableTo": "2025-06-30"
}
```
- `title` (string, required)
- `description` (string, required)
- `address` (string, required)
- `price` (number, required)
- `images` (array of strings, optional)
- `amenities` (array of strings, optional)
- `availableFrom` (date string, required)
- `availableTo` (date string, required)

---

#### **PUT `/api/listings/:id`**
Update a listing (host only).

**Payload:** (same as above, all fields optional)

---

### Booking Routes

#### **POST `/api/bookings`**
Create a new booking.

**Payload:**
```json
{
  "listingId": "listing_object_id",
  "checkIn": "2025-06-20",
  "checkOut": "2025-06-25",
  "guests": 2
}
```
- `listingId` (string, required)
- `checkIn` (date string, required)
- `checkOut` (date string, required)
- `guests` (number, required)

---

## Authentication

- Register and login return a JWT token (usually set as a cookie).
- Protected routes require the token (sent via cookie or Authorization header).

---

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT Authentication
- Cloudinary (image uploads)
- bcryptjs (password hashing)
- dotenv, cors, cookie-parser

---

## Project Structure

```
backend/
  controllers/
  lib/
  middlewares/
  models/
  routers/
  .env
  package.json
  server.js
```

---

**Note:**  
- All protected routes require a valid JWT token.
- Host-only routes require the user to have a host role.
- All dates should be in ISO format (`YYYY-MM-DD`).
- For image uploads, upload to Cloudinary first and send the resulting URLs in the