const express = require('express');
const app = express();
app.use(express.json());

let tasks = [
  { id: 1, title: "Einkaufen gehen", description: "Milch, Brot, Eier kaufen", completed: false },
  { id: 2, title: "Lernen", description: "GraphQL und REST verstehen", completed: true },
  { id: 3, title: "Joggen", description: "5km Runde", completed: false }
];

//PUT /tasks/:id → Aufgabe aktualisieren
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Aufgabe nicht gefunden" });

  const { title, description, completed } = req.body;
  if (!title || !description || completed === undefined) return res.status(400).json({ error: "Fehlende Felder" });

  task.title = title;
  task.description = description;
  task.completed = completed;
  res.json(task);
});

//DELETE /tasks/:id → Aufgabe löschen
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Aufgabe nicht gefunden" });

  tasks.splice(index, 1);
  res.status(204).send();
});

//GET /tasks?completed=true → Aufgaben nach Status filtern
app.get('/tasks', (req, res) => {
  if (req.query.completed) {
    const status = req.query.completed === "true";
    return res.json(tasks.filter(t => t.completed === status));
  }
  res.json(tasks);
});

app.listen(5000, () => console.log('Server läuft auf Port 5000'));
