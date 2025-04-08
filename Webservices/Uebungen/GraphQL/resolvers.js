let tasks = [
  { id: 1, title: "Einkaufen gehen", description: "Milch, Brot, Eier kaufen", completed: false },
  { id: 2, title: "Lernen", description: "GraphQL und REST verstehen", completed: true },
  { id: 3, title: "Joggen", description: "5km Runde", completed: false }
];

const resolvers = {
  Query: {
    tasks: (_, { completed }) => {
      if (completed !== undefined) {
        return tasks.filter(task => task.completed === completed);
      }
      return tasks;
    },
    task: (_, { id }) => {
      return tasks.find(task => task.id === parseInt(id));
    }
  },
  Mutation: {
    updateTask: (_, { id, title, description, completed }) => {
      const task = tasks.find(t => t.id === parseInt(id));
      if (!task) {
        throw new Error("Aufgabe nicht gefunden");
      }

      task.title = title;
      task.description = description;
      task.completed = completed;
      return task;
    },
    deleteTask: (_, { id }) => {
      const index = tasks.findIndex(t => t.id === parseInt(id));
      if (index === -1) {
        throw new Error("Aufgabe nicht gefunden");
      }

      tasks.splice(index, 1);
      return true;
    }
  }
};

module.exports = resolvers; 