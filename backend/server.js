import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js'; // <-- IMPORT NOU

// Configurăm variabilele de mediu
dotenv.config();

// Ne conectăm la baza de date
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Conectăm rutele
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes); // <-- LINIE NOUĂ

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serverul rulează cu succes pe portul ${PORT}`);
});
