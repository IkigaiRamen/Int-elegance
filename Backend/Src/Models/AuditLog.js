const mongoose = require('mongoose');

const { Schema } = mongoose;

const AuditLogSchema = new Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
