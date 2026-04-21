const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const logger = require('morgan');// Für Logging der HTTP-Requests
const path = require('path');
const router = require('./routes/index');// Importiert zentrale Routen (aus routes/index.js)
const { auth } = require('express-openid-connect');// Auth0 Middleware für Login/Logout via OpenID Connect

// Lädt Umgebungsvariablen aus .env-Datei (CLIENT_ID, ISSUER_BASE_URL etc.)
dotenv.load();
// Express-Anwendung erstellen
const app = express();

// View Engine konfigurieren: EJS-Dateien im Ordner /views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware: Logging, statische Dateien und JSON-Parsing
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Auth0-Konfiguration (Basis)
const config = {
  authRequired: false,
  auth0Logout: true
};
// Dynamische baseURL für lokale Entwicklung setzen
const port = process.env.PORT || 3000;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}
// Auth0-Middleware aktivieren (stellt /login, /logout, /callback bereit)
app.use(auth(config));

// Middleware: Benutzerinfos (req.oidc.user) für Views bereitstellen
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

// Haupt-Router aktivieren
app.use('/', router);

// Fehler: 404 – Route nicht gefunden
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Fehlerbehandlung: rendert error.ejs mit Message
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});
// HTTP-Server starten
http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
