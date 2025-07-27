import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  // Verificăm dacă token-ul este trimis în header și începe cu "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extragem token-ul (fără "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Verificăm dacă token-ul este valid
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Găsim utilizatorul după ID-ul din token și îl atașăm la obiectul `req`
      // pentru a-l putea folosi în rutele protejate
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Trecem la următoarea funcție (controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Neautorizat, token eșuat' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Neautorizat, fără token' });
  }
};

export { protect };
