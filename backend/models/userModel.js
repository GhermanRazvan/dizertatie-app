import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Fiecare email trebuie să fie unic
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Metodă pentru a compara parola introdusă cu cea hăshuită din DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hăshuiește parola înainte de a salva un utilizator nou
userSchema.pre('save', async function (next) {
  // Rulează doar dacă parola a fost modificată (sau este nouă)
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
