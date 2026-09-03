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

    const { firstName, lastName, age, password } = req.body;

    const updateData = { firstName, lastName, age };

    // Only hash and include password if the user actually sent a new one
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
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
