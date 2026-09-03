const User = require('../models/user.model');
const bcrypt = require("bcrypt");
// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: 'Not authorized to view this profile' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) { 
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

// Update user profile (Secured)
exports.updateProfile = async (req, res, next) => {
  try {
    // Check if the user making the request is the owner or an admin
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this profile' });
    }

    const { firstName, lastName, age, phone, password } = req.body || {};

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (age !== undefined) updateData.age = age;
    if (phone !== undefined) updateData.phone = typeof phone === 'string' ? phone.trim() : phone;

    // Only hash and include password if the user actually sent a new one
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
}
