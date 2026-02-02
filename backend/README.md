# EduGuide Backend API

Production-ready TypeScript + MongoDB backend for the EduGuide Education Platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Seed the database (optional):**
```bash
npm run seed
```

4. **Start development server:**
```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Auth, validation, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── seeds/           # Sample data seeder
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   ├── validators/      # Input validation rules
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔐 Authentication

All protected routes require a Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📚 API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/signup` | Register new user | Public |
| POST | `/login` | Login & get token | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update profile | Private |
| PUT | `/password` | Change password | Private |

### Booking Routes (`/api/bookings`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create booking | Student |
| GET | `/` | List bookings | Private |
| GET | `/:id` | Get booking | Private |
| PATCH | `/:id/status` | Update status | Private |

### Counsellor Routes (`/api/counsellors`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List counsellors | Public |
| GET | `/me` | Get own profile | Counsellor |
| GET | `/:id` | Get counsellor | Public |
| PUT | `/profile` | Update profile | Counsellor |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/stats` | Platform stats | Admin |
| GET | `/users` | List all users | Admin |
| PATCH | `/users/:id/status` | Block/unblock user | Admin |
| GET | `/counsellors/pending` | Pending counsellors | Admin |
| PATCH | `/counsellors/:id/verify` | Verify counsellor | Admin |
| GET | `/bookings` | All bookings | Admin |

---

## 🔒 Security Features

- ✅ JWT authentication with expiration
- ✅ Password hashing with bcrypt (cost factor 12)
- ✅ Rate limiting (100 requests/15 min)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation with express-validator
- ✅ Role-based access control
- ✅ SQL injection prevention (NoSQL injection safe)

---

## 🧪 Test Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eduguide.com | Admin@123 |
| Student | arun@example.com | Student@123 |
| Counsellor | priya.sharma@eduguide.com | Counsellor@123 |

---

## 🚀 Deployment

### Build for production:
```bash
npm run build
npm start
```

### Deploy to:
- **Railway**: Connect GitHub repo, add env vars
- **Render**: Connect repo, set build command
- **DigitalOcean App Platform**: Import from GitHub
- **Heroku**: Use Node.js buildpack

### Environment Variables Required:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
FRONTEND_URL=https://student-counsellor.lovable.app
```

---

## 🔗 Frontend Integration

After deploying, provide your API URL. I'll update the Lovable frontend to:
1. Replace localStorage auth with API calls
2. Connect booking form to real database
3. Link dashboards to live data
