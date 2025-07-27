import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js'; // <-- IMPORTĂM GARDIANUL

const router = express.Router();

// Aplicăm gardianul `protect` pe toate rutele.
router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').get(protect, getTaskById).put(protect, updateTask).delete(protect, deleteTask);

export default router;
