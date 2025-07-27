import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
// Am eliminat importul pentru 'protect'

const router = express.Router();

// Am eliminat 'protect' din fața fiecărei rute. Acum sunt din nou publice.
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
