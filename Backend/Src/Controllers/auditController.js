const AuditLog = require('../Models/AuditLog');
const { Request, Response } = require('express');

module.exports = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('userId'); // Assuming you have a user reference
    res.status(200).json(logs);
  } catch (error) {
    // Type assertion to specify that error is of type Error
    res.status(400).json({ message: error.message });
  }
};
