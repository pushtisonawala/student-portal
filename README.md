# EduSync Hub - Student Portal

A modern student management system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Setting Up the Project

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd student-portal
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Running the Application**

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📦 Key Features

- 👤 User Authentication (Login/Register)
- 📋 Student Profile Management
- 📊 Academic Performance Tracking
- 📈 Grade Calculation System
- 📅 Attendance Tracking

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- CORS for cross-origin requests

## 📝 API Endpoints

- **Auth Routes**
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - User login

- **Profile Routes**
  - GET `/api/profile` - Get user profile
  - POST `/api/profile` - Create/Update profile

- **Dashboard Routes**
  - GET `/api/dashboard` - Get dashboard data

## 🔐 Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
PORT=5000
```

## 🌐 Deployment

- Backend is deployed on Render
- Frontend is deployed on Vercel

## 📚 Additional Information

- Grades are automatically calculated based on marks
- Profile updates are reflected immediately on dashboard
- JWT token expires in 1 hour for security

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

