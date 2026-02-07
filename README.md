# Blog API

A production-ready RESTful Blog API built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- **JWT Authentication**: Secure user registration and login
- **Full CRUD**: Complete post management with authorization
- **Advanced Filtering**: Pagination, search, tags, author, status filters  
- **Soft Delete**: Posts can be recovered
- **Auto Slugs**: SEO-friendly URLs generated automatically
- **Input Validation**: Comprehensive validation with express-validator
- **Error Handling**: Centralized error handling with proper HTTP codes
- **Security**: Helmet, CORS, rate limiting, password hashing

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start MongoDB
mongod

# Run the server
npm run dev
```

Server runs at: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user (Protected)

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post (by ID or slug)
- `POST /api/posts` - Create post (Protected)
- `PUT /api/posts/:id` - Update post (Protected, Owner only)
- `DELETE /api/posts/:id` - Delete post (Protected, Owner/Admin)
- `GET /api/posts/user/my-posts` - Get user's posts (Protected)

## Query Parameters

```
GET /api/posts?page=1&limit=10&search=mongodb&tags=tech,tutorial&status=published&sortBy=publishedAt&order=desc
```

## Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "bio": "A passionate blogger"
  }'
```

### Create Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first blog post!",
    "tags": ["tech", "first-post"],
    "status": "published"
  }'
```

### Get All Posts
```bash
curl http://localhost:5000/api/posts
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/blog-api
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Generate a secure JWT secret for production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```


## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose  
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- Helmet for security headers
- CORS for cross-origin requests
- express-rate-limit for rate limiting

## Error Handling

The API uses centralized error handling with proper HTTP status codes:
- 400: Bad Request (validation errors, invalid data)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

All errors return a consistent JSON format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Features in Detail

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes middleware
- Role-based access control (user/admin)
- Ownership-based authorization

### Post Management
- Create, read, update, delete posts
- Draft and published status
- Auto-generated slugs from titles
- Soft delete with recovery option
- Post ownership validation

### Advanced Filtering
- Pagination with page and limit
- Full-text search in title and content
- Filter by tags (comma-separated)
- Filter by author ID
- Filter by status (draft/published)
- Sort by any field (asc/desc)

### Security
- Helmet for HTTP headers
- CORS configuration
- Rate limiting (100 req/15min)
- Input validation and sanitization
- Password hashing with bcrypt
- JWT token expiration
- MongoDB connection retry logic
- Specific error handling for database operations

