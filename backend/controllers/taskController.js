import Task from '../models/taskModel.js';

// @desc    Creează un task nou
const createTask = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    if (!title) {
      res.status(400).json({ message: 'Titlul este obligatoriu.' });
      return;
    }
    const task = await Task.create({
      title,
      description,
      location,
      user: req.user._id, // Legăm task-ul de utilizatorul autentificat
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Preia task-urile utilizatorului autentificat
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Actualizează un task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task && task.user.equals(req.user._id)) {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      if (req.body.isCompleted !== undefined) {
        task.isCompleted = req.body.isCompleted;
      }
      task.location = req.body.location || task.location;
      const updatedTask = await task.save();
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task-ul nu a fost găsit sau nu aveți permisiunea' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Șterge un task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task && task.user.equals(req.user._id)) {
      await task.deleteOne();
      res.status(200).json({ message: 'Task șters cu succes' });
    } else {
      res.status(404).json({ message: 'Task-ul nu a fost găsit sau nu aveți permisiunea' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Preia un singur task după ID
const getTaskById = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (task && task.user.equals(req.user._id)) {
        res.status(200).json(task);
      } else {
        res.status(404).json({ message: 'Task-ul nu a fost găsit sau nu aveți permisiunea' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

export { createTask, getTasks, getTaskById, updateTask, deleteTask };
