const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/user', requiresAuth(), checkRole('user'), (req, res) => {
  res.send('👤 Willkommensseite für Benutzer (user)');
});

router.get('/admin', requiresAuth(), checkRole('admin'), (req, res) => {
  res.send('🛡️ Admin-Bereich – Zugriff nur für Admins');
});

module.exports = router;
