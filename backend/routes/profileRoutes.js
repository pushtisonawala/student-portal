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
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
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
    const { dateOfBirth } = req.body;

    // Validate date of birth
    if (!validateDateOfBirth(dateOfBirth)) {
      return res.status(400).json({ 
        message: "Date of birth must be before 2011" 
      });
    }

    const profileFields = {
      user: req.user.id,
      ...req.body
    };

    let profile = await Profile.findOne({ user: req.user.id });
    
    if (profile) {
      // Update
      profile.set(profileFields);
      await profile.save(); // This will trigger grade calculation
      return res.json({ 
        profile: {
          ...profile.toObject(),
          grade: profile.calculatedGrade,
          average: profile.calculatedAverage
        },
        message: "Profile updated successfully" 
      });
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json({ 
      profile: {
        ...profile.toObject(),
        grade: profile.calculatedGrade,
        average: profile.calculatedAverage
      },
      message: "Profile created successfully" 
    });
  } catch (error) {
    console.error("Profile operation error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
