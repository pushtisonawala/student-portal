const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Profile = require("../models/Profile");

// Test route
router.get("/test", (req, res) => {
  console.log("Test endpoint hit");
  res.json({ message: "Dashboard route test successful" });
});

// Main dashboard route with auth
router.get("/", auth, async (req, res) => {
  try {
    console.log("Dashboard endpoint hit with user:", req.user.id);
    
    // Get user data
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get profile data with marks
    const profile = await Profile.findOne({ user: req.user.id });
    
    // If profile exists and has marks, trigger recalculation
    if (profile && profile.marks) {
      await profile.save(); // This will trigger the pre-save hook
    }

    // Calculate grade and average if marks exist
    const dashboardResponse = {
      user,
      profile: profile ? {
        ...profile.toObject(),
        grade: profile.calculatedGrade,
        average: profile.calculatedAverage
      } : null,
      profileComplete: !!profile
    };

    // Log the response for debugging
    console.log('Dashboard Response:', dashboardResponse);
    
    // Send response
    res.json(dashboardResponse);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
