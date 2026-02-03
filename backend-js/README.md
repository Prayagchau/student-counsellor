# EduGuide Backend (JavaScript)

Production-ready Node.js + Express + MongoDB backend for the Student Counsellor Platform.

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
backend-js/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   ├── AdminController.js
│   │   ├── AuthController.js
│   │   ├── BookingController.js
│   │   └── CounsellorController.js
│   ├── middlewares/
│   │   ├── auth.js           # JWT authentication
│   │   ├── error.js          # Error handling
│   │   └── validate.js       # Input validation
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Counsellor.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── counsellors.js
│   │   └── users.js
│   ├── seeds/
│   │   └── seed.js           # Database seeding
│   ├── utils/
│   │   ├── jwt.js
│   │   └── response.js
│   ├── validators/
│   │   └── index.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend-js
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduguide
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://student-counsellor.lovable.app
```

### 3. Start MongoDB

Make sure MongoDB is running locally, or use MongoDB Atlas.

### 4. Seed Database

```bash
npm run seed
```

This creates test accounts:
- **Admin**: admin@eduguide.com / admin123
- **User**: john@student.com / password123
- **Counsellor**: sarah@counsellor.com / password123

### 5. Start Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login & get token | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/password` | Change password | Private |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users/me` | Get current user | Private |

### Counsellors
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/counsellors` | List approved counsellors | Public |
| GET | `/api/counsellors/:id` | Get counsellor by ID | Public |
| GET | `/api/counsellors/me` | Get my profile | Counsellor |
| POST | `/api/counsellors/profile` | Create/update profile | Counsellor |
| GET | `/api/counsellors/bookings` | Get my bookings | Counsellor |

### Bookings
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/bookings` | Create booking | User |
| GET | `/api/bookings/my` | Get my bookings | Private |
| GET | `/api/bookings/:id` | Get booking details | Private |
| PUT | `/api/bookings/:id/cancel` | Cancel booking | User |
| PUT | `/api/bookings/:id/status` | Update status | Counsellor |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/stats` | Platform statistics | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| PUT | `/api/admin/users/:id/status` | Block/unblock user | Admin |
| GET | `/api/admin/counsellors` | List all counsellors | Admin |
| PUT | `/api/admin/counsellors/:id/approve` | Approve/reject | Admin |
| GET | `/api/admin/bookings` | List all bookings | Admin |

## Deployment

### Railway

1. Create a new Railway project
2. Add MongoDB plugin or connect external MongoDB
3. Set environment variables
4. Deploy from GitHub

### Render

1. Create a new Web Service
2. Connect your GitHub repo
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Heroku

```bash
heroku create your-app-name
heroku config:set MONGODB_URI="your-mongo-uri"
heroku config:set JWT_SECRET="your-secret"
heroku config:set FRONTEND_URL="your-frontend-url"
git push heroku main
```

## Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT authentication with expiration
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting on auth routes
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation with express-validator
- ✅ Centralized error handling

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Business Rules

1. **Users** can only book approved counsellors
2. **Double booking prevention** via compound index
3. **Counsellors** must be approved by admin before appearing publicly
4. **Booking status flow**: pending → approved/rejected → completed/cancelled
5. **Rate limiting**: 10 auth attempts per 15 minutes
