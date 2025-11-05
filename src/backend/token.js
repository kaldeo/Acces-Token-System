const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const users = [
  { login: 'admin', pass: 'admin123' },
  { login: 'user', pass: 'user123' }
];

router.post('/login', (req, res) => {
  const { login, pass } = req.body;
  
  const user = users.find(u => u.login === login && u.pass === pass);
  
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  
  // Créer le token (sans le mot de passe)
  const token = jwt.sign({ login: user.login }, process.env.JWT_SECRET, { expiresIn: '24h' });
  
  res.json({ token, login: user.login });
});

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    req.user = user;
    next();
  });
}

// Route protégée pour vérifier si le token est valide
router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;