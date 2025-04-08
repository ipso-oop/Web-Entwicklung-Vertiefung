const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// In-memory database
let tasks = [
  { id: 1, title: "Einkaufen gehen", description: "Milch, Brot, Eier kaufen", completed: false },
  { id: 2, title: "Lernen", description: "GraphQL und REST verstehen", completed: true }
];

// API Version and base path
const API_VERSION = 'v1';
const BASE_PATH = `/api/${API_VERSION}`;

// Validation middleware
const validateTask = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 1) {
    errors.push('Titel ist erforderlich und muss ein gültiger Text sein');
  }
  if (!description || typeof description !== 'string' || description.trim().length < 1) {
    errors.push('Beschreibung ist erforderlich und muss ein gültiger Text sein');
  }
  if (req.body.completed !== undefined && typeof req.body.completed !== 'boolean') {
    errors.push('Status (completed) muss ein Boolean sein');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      errors: errors
    });
  }

  next();
};

// GET /api/v1/tasks - Alle Aufgaben abrufen
app.get(`${BASE_PATH}/tasks`, (req, res) => {
  try {
    if (req.query.completed) {
      const status = req.query.completed === "true";
      return res.json({
        status: 'success',
        data: tasks.filter(t => t.completed === status)
      });
    }
    res.json({
      status: 'success',
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Interner Serverfehler'
    });
  }
});

// GET /api/v1/tasks/:id - Einzelne Aufgabe abrufen
app.get(`${BASE_PATH}/tasks/:id`, (req, res) => {
  try {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Aufgabe nicht gefunden'
      });
    }
    res.json({
      status: 'success',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Interner Serverfehler'
    });
  }
});

// POST /api/v1/tasks - Neue Aufgabe erstellen
app.post(`${BASE_PATH}/tasks`, validateTask, (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      title,
      description,
      completed: false
    };
    tasks.push(newTask);
    res.status(201).json({
      status: 'success',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Interner Serverfehler'
    });
  }
});

// PUT /api/v1/tasks/:id - Aufgabe aktualisieren
app.put(`${BASE_PATH}/tasks/:id`, validateTask, (req, res) => {
  try {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Aufgabe nicht gefunden'
      });
    }

    const { title, description, completed } = req.body;
    task.title = title;
    task.description = description;
    task.completed = completed !== undefined ? completed : task.completed;

    res.json({
      status: 'success',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Interner Serverfehler'
    });
  }
});

// DELETE /api/v1/tasks/:id - Aufgabe löschen
app.delete(`${BASE_PATH}/tasks/:id`, (req, res) => {
  try {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Aufgabe nicht gefunden'
      });
    }

    tasks.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Interner Serverfehler'
    });
  }
});

// Error handling für nicht gefundene Routen
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route nicht gefunden'
  });
});

// Error handling für alle anderen Fehler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Interner Serverfehler'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
