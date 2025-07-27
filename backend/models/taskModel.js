import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    // Am eliminat câmpul 'user'
    title: {
      type: String,
      required: [true, 'Te rog adaugă un titlu pentru task.'],
    },
    description: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    location: {
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
