const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Project Schema
const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }, // Optional description
  category: { type: String }, // Category of the project
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }, // Priority level
  profilePicture: { type: String }, // Required profile picture

  // Start and end dates
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }, // Required end date

  // Creator of the project
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // List of users working on the project
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  // List of tasks associated with the project
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],

  // Status of the project
  status: {
    type: String,
    enum: ['in progress', 'completed', 'waiting for approval', 'cancelled'],
    default: 'in progress',
    required: true
  },

  // Chat references, assuming there's a separate Chat schema
  //chat: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],

  // Notifications for the project
  notifications: [{
    action: { 
      type: String, 
      required: true // Action like "Add New Task", "Project Completed", etc.
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who triggered the action
    createdAt: { type: Date, default: Date.now }, // Timestamp of when the notification was created
    read: { type: Boolean, default: false }, // Whether the notification has been read
  }]
});

// Export the model
module.exports = mongoose.model('Project', ProjectSchema);
