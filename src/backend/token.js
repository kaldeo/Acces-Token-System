const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

// Définition des rôles et permissions
const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
};

const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  MANAGE_USERS: 'manage_users',
  EDIT_SETTINGS: 'edit_settings'
};

// Permissions par rôle
const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.READ,
    PERMISSIONS.WRITE,
    PERMISSIONS.DELETE,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.EDIT_SETTINGS
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.READ,
    PERMISSIONS.WRITE,
    PERMISSIONS.DELETE
  ],
  [ROLES.USER]: [
    PERMISSIONS.READ,
    PERMISSIONS.WRITE
  ],
  [ROLES.GUEST]: [
    PERMISSIONS.READ
  ]
};

// Utilisateurs avec rôles
const users = [
  { login: 'admin', pass: 'admin123', role: ROLES.ADMIN },
  { login: 'moderator', pass: 'mod123', role: ROLES.MODERATOR },
  { login: 'user', pass: 'user123', role: ROLES.USER },
  { login: 'guest', pass: 'guest123', role: ROLES.GUEST }
];

router.post('/login', (req, res) => {
  const { login, pass } = req.body;
  
  const user = users.find(u => u.login === login && u.pass === pass);
  
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  
  // Récupérer les permissions de l'utilisateur
  const permissions = rolePermissions[user.role] || [];
  
  // Créer le token avec le rôle et les permissions
  const token = jwt.sign(
    { 
      login: user.login,
      role: user.role,
      permissions: permissions
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ 
    token, 
    login: user.login,
    role: user.role,
    permissions: permissions
  });
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