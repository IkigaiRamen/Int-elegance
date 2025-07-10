const { Schema, model } = require('mongoose');

const WorkflowSchema = new Schema({
  name: { type: String, required: true, unique: true },
  stages: [{ type: String, required: true }],
  transitions: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
      condition: { type: String }
    }
  ],
  rules: [
    {
      stage: { type: String, required: true },
      rule: { type: String, required: true }
    }
  ]
});

module.exports = model('Workflow', WorkflowSchema);
