import { findById } from '../Models/Task';
import { IWorkflow } from '../Models/Workflow';

async function validateTaskTransition(req, res, next) {
  const { taskId, newStage } = req.body;

  // Fetch task and populate workflow
  const task = await findById(taskId).populate('workflow');

  // Check if task exists
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Ensure the workflow is of the correct type
  const workflow = task.workflow;

  if (!workflow) {
    return res.status(400).json({ message: 'Workflow not found for this task' });
  }

  // Validate the transition
  const validTransition = workflow.transitions.some(
    (transition) => transition.from === task.stage && transition.to === newStage
  );

  if (!validTransition) {
    return res.status(400).json({ message: 'Invalid stage transition' });
  }

  next();
}

export default validateTaskTransition;
