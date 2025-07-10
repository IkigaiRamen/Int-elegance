const { logAction } = require('../Utils/auditLogger');
const Workflow = require('../Models/Workflow');

// Create a new workflow
exports.createWorkflow = async (req, res) => {
  const { name, stages, transitions, rules } = req.body;

  try {
    const workflow = new Workflow({ name, stages, transitions, rules });
    const createdWorkflow = await workflow.save();

    // Check if user ID is defined before logging
    if (req.user?._id) {
      await logAction(req.user._id, 'CREATE_WORKFLOW', 'Workflow', createdWorkflow._id.toString());
    }

    res.status(201).json(createdWorkflow);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

// Get a workflow by ID or all workflows
exports.getWorkflow = async (req, res) => {
  try {
    let workflows;

    if (req.query.id) {
      workflows = await Workflow.findById(req.query.id);
    } else {
      workflows = await Workflow.find({});
    }

    if (req.user?._id) {
      const actionType = req.query.id ? 'GET_WORKFLOW_BY_ID' : 'GET_ALL_WORKFLOWS';
      await logAction(req.user._id, actionType, 'Workflow', req.query.id ? req.query.id.toString() : 'All');
    }

    res.status(200).json(workflows);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a workflow by ID
exports.updateWorkflow = async (req, res) => {
  try {
    const updatedWorkflow = await Workflow.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedWorkflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    if (req.user?._id) {
      await logAction(req.user._id, 'UPDATE_WORKFLOW', 'Workflow', updatedWorkflow._id.toString());
    }

    res.status(200).json(updatedWorkflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a workflow by ID
exports.deleteWorkflow = async (req, res) => {
  try {
    const deletedWorkflow = await Workflow.findByIdAndDelete(req.params.id);

    if (!deletedWorkflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    if (req.user?._id) {
      await logAction(req.user._id, 'DELETE_WORKFLOW', 'Workflow', req.params.id);
    }

    res.status(200).json({ message: 'Workflow deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
