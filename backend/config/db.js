import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🔌 MongoDB Conectat: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Eroare la conectare: ${error.message}`);
    process.exit(1); // Oprește aplicația dacă nu se poate conecta
  }
};

export default connectDB;