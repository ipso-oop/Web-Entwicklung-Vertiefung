const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const router = require('./routes/index');
const { auth } = require('express-openid-connect');

dotenv.config(); // Richtiger Befehl zum Laden der .env

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const port = process.env.PORT || 3000;
const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL || `http://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.CLIENT_SECRET
};

app.use(auth(config));

// user für Views verfügbar machen
app.use((req, res, next) => {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', router);

// 404
app.use((req, res, next) => {
  const err = new Error('Nicht gefunden');
  err.status = 404;
  next(err);
});

// Fehlerseite
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});

http.createServer(app).listen(port, () => {
  console.log(`✅ App läuft auf ${config.baseURL}`);
});
