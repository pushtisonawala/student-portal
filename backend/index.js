const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Debug middleware - Add before routes
app.use((req, res, next) => {
  console.log('\n=== Request ===');
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  console.log('==============\n');
  next();
});

// Essential Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Basic test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes); // Ensure this is mounted before 404 handler
app.use("/api/dashboard", dashboardRoutes);

// Database connection with SSL options
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
})
.then(() => {
  console.log("MongoDB Connected Successfully");
})
.catch(err => {
  console.error("MongoDB Connection Error:");
  console.error("Error details:", err);
  console.error("Please check your MongoDB configuration");
  process.exit(1);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Route not found:', req.method, req.path);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/dashboard');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/auth/register');
});
