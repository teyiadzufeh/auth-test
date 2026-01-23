# Auth Test API

A simple authentication API built with Node.js, TypeScript, Express, and PostgreSQL. This project demonstrates JWT-based authentication using access and refresh tokens, along with security best practices like rate limiting and input validation.

## Features

- User registration and login
- JWT access and refresh token authentication
- Password hashing with bcrypt
- PostgreSQL database integration
- Rate limiting for API endpoints
- CORS and Helmet for security
- Input validation middleware
- Error handling middleware
- TypeScript for type safety

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/auth-test.git
   cd auth-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/auth_test
   PORT=3000
   JWT_ACCESS_SECRET=your_access_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. Set up the database:
   - Create a PostgreSQL database named `auth_test`
   - The application will handle table creation automatically (assuming you have the User model set up)

## Usage

### Development

Run the development server with hot reloading:
```bash
npm run dev
```

### Production

Build and run the production server:
```bash
npm run build
npm start
```

The server will start on port 3000 (or the port specified in your `.env` file).

## API Endpoints

### Authentication

- **POST /api/auth/register**
  - Register a new user
  - Body: `{ "email": "user@example.com", "password": "password", "name": "User Name" }`
  - Response: User data with access and refresh tokens

- **POST /api/auth/login**
  - Login with existing credentials
  - Body: `{ "email": "user@example.com", "password": "password" }`
  - Response: User data with access and refresh tokens

- **POST /api/auth/refresh**
  - Refresh access token using refresh token
  - Body: `{ "refreshToken": "your_refresh_token" }`
  - Response: New access token

- **GET /api/auth/me**
  - Get current user information (requires authentication)
  - Headers: `Authorization: Bearer <access_token>`
  - Response: Current user data

### Health Check

- **GET /health**
  - Check server status
  - Response: `{ "status": "ok" }`

## Project Structure

```
src/
├── controllers/
│   └── auth.controller.ts   # Authentication logic
├── middleware/
│   ├── auth.ts              # JWT authentication middleware
│   └── validation.ts        # Input validation middleware
├── models/
│   └── User.ts              # User model
├── routes/
│   └── auth.ts              # Authentication routes
├── utils/
│   ├── jwt.ts               # JWT token utilities
└── server.ts                # Main server file
```

## Technologies Used

- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript
- **Express**: Web framework
- **PostgreSQL**: Database
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **express-rate-limit**: Rate limiting

## Security Features

- JWT tokens with separate access and refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Helmet for security headers
- CORS configuration
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

[Teyi Adzufeh](https://github.com/teyiadzufeh)

---

*This is a portfolio project demonstrating authentication best practices with modern web technologies.*