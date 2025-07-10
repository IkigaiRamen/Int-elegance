const mongoose = require('mongoose');
const { Schema } = mongoose;

const CompanySchema = new Schema({
  name: { type: String, required: true }, // Company name
  address: { type: String }, // Company address
  email: { type: String }, // Company email
  website: { type: String }, // Company website
  description: { type: String }, // Company description
  phoneNumber: { type: String }, // Company phone number
  logo: { type: String }, // Optional company logo URL
  employees: [{ type: Schema.Types.ObjectId, ref: 'User' }], // List of employees (users) in the company
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }], // List of projects associated with the company
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the company
  createdAt: { type: Date, default: Date.now }, // When the company was created
});

module.exports = mongoose.model('Company', CompanySchema);
