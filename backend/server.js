// Importăm pachetele necesare
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // <-- Importă funcția
import userRoutes from './routes/userRoutes.js'; // <-- IMPORT NOU

// ... importurile existente
import taskRoutes from './routes/taskRoutes.js'; // <-- Importă rutele

// Configurăm variabilele de mediu din fișierul .env
dotenv.config();

// Ne conectăm la baza de date
connectDB(); // <-- Apelează funcția aici

// Inițializăm aplicația Express
const app = express();

// Folosim middleware-uri
app.use(cors()); // Permite cereri cross-origin
app.use(express.json()); // Permite serverului să înțeleagă JSON-ul trimis în corpul cererilor


// Definim portul pe care va rula serverul
// Îl luăm din variabilele de mediu sau folosim 5000 ca valoare implicită
const PORT = process.env.PORT || 5000;

// Creăm o rută de test pentru a verifica dacă serverul funcționează
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Aici îi spunem aplicației să folosească rutele importate
// pentru orice request care începe cu /api/tasks
app.use('/api/tasks', taskRoutes); // <-- Adaugă această linie
app.use('/api/users', userRoutes); // <-- LINIE NOUĂ
// Pornim serverul și ascultăm pe portul specificat
app.listen(PORT, () => {
  console.log(`🚀 Serverul rulează cu succes pe portul ${PORT}`);
});