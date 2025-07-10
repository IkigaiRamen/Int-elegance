const AuditLog = require('../Models/AuditLog');

module.exports.logAction = async (userId, action, resourceType, resourceId) => {
  try {
    const logEntry = new AuditLog({ userId, action, resourceType, resourceId });
    await logEntry.save();
  } catch (error) {
    console.error('Error logging action:', error);
  }
};
