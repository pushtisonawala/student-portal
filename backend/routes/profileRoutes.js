const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Profile = require("../models/Profile");

// Validation helper
const validateDateOfBirth = (dob) => {
  const dobDate = new Date(dob);
  const cutoffDate = new Date('2010-12-31');
  return dobDate <= cutoffDate;
};

// Get current user's profile
router.get("/", auth, async (req, res) => {
  try {
    console.log("Fetching profile for user:", req.user.id);
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Calculate grade and return complete profile
    const profileData = {
      ...profile.toObject(),
      grade: profile.calculatedGrade,
      average: profile.calculatedAverage
    };

    console.log("Sending profile data:", profileData);
    res.json(profileData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Test route to verify router is working
router.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Profile routes working" });
});

// Create or update profile
router.post("/", auth, async (req, res) => {
  try {
    console.log("Received profile update:", req.body);
    
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (profile) {
      // Update existing profile
      profile.set({
        ...req.body,
        user: req.user.id
      });
    } else {
      // Create new profile
      profile = new Profile({
        ...req.body,
        user: req.user.id
      });
    }

    await profile.save();
    
    // Return updated profile with calculated fields
    const updatedProfile = {
      ...profile.toObject(),
      grade: profile.calculatedGrade,
      average: profile.calculatedAverage
    };

    console.log("Updated profile:", updatedProfile);
    res.json({
      profile: updatedProfile,
      message: profile.isNew ? "Profile created successfully" : "Profile updated successfully"
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
