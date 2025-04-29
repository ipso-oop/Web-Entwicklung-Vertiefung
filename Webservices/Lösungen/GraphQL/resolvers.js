const { ValidationError, NotFoundError } = require('./errors');
const { GraphQLError } = require('graphql');

// V2 tasks with extended features
let tasksV2 = [
  { 
    id: 1, 
    title: "Einkaufen gehen", 
    description: "Milch, Brot, Eier kaufen", 
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: "MEDIUM",
    dueDate: "2024-03-20",
    tags: ["einkauf", "wichtig"]
  },
  { 
    id: 2, 
    title: "Lernen", 
    description: "GraphQL und REST verstehen", 
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: "HIGH",
    dueDate: "2024-03-15",
    tags: ["studium", "webdev"]
  }
];

// Legacy V1 tasks
let tasks = [
  { 
    id: 1, 
    title: "Einkaufen gehen", 
    description: "Milch, Brot, Eier kaufen", 
    completed: false,
   
  },
  { 
    id: 2, 
    title: "Lernen", 
    description: "GraphQL und REST verstehen", 
    completed: true,
   
  },
  { 
    id: 3, 
    title: "Joggen", 
    description: "5km Runde", 
    completed: false,
   
  }
];

const createError = (code, message) => ({
  code,
  message
});

const v1Resolvers = {
  Query: {
    tasks: (_, { completed }) => {
      try {
        let filteredTasks = tasks;
        if (completed !== undefined) {
          filteredTasks = tasks.filter(task => task.completed === completed);
        }
        return {
          success: true,
          tasks: filteredTasks
        };
      } catch (error) {
        return {
          success: false,
          tasks: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    },
    task: (_, { id }) => {
      try {
        const task = tasks.find(task => task.id === parseInt(id));
        if (!task) {
          return {
            success: false,
            task: null,
            error: createError('NOT_FOUND', `Task with ID ${id} not found`)
          };
        }
        return {
          success: true,
          task
        };
      } catch (error) {
        return {
          success: false,
          task: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    }
  },
  Mutation: {
    createTask: (_, { input }) => {
      try {
        const newTask = {
          id: Math.max(...tasks.map(t => t.id)) + 1,
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        tasks.push(newTask);
        return {
          success: true,
          task: newTask
        };
      } catch (error) {
        return {
          success: false,
          task: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    },
    updateTask: (_, { id, input }) => {
      try {
        const task = tasks.find(t => t.id === parseInt(id));
        if (!task) {
          return {
            success: false,
            task: null,
            error: createError('NOT_FOUND', `Task with ID ${id} not found`)
          };
        }

        Object.assign(task, input);
        task.updatedAt = new Date().toISOString();

        return {
          success: true,
          task
        };
      } catch (error) {
        return {
          success: false,
          task: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    },
    deleteTask: (_, { id }) => {
      try {
        const index = tasks.findIndex(t => t.id === parseInt(id));
        if (index === -1) {
          return {
            success: false,
            error: createError('NOT_FOUND', `Task with ID ${id} not found`)
          };
        }

        tasks.splice(index, 1);
        return {
          success: true
        };
      } catch (error) {
        return {
          success: false,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    }
  }
};

const v2Resolvers = {
  Query: {
    tasks: (_, { completed, priority }) => {
      try {
        let filteredTasks = tasksV2;
        if (completed !== undefined) {
          filteredTasks = filteredTasks.filter(task => task.completed === completed);
        }
        if (priority) {
          filteredTasks = filteredTasks.filter(task => task.priority === priority);
        }
        return {
          success: true,
          tasks: filteredTasks
        };
      } catch (error) {
        return {
          success: false,
          tasks: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    },
    task: (_, { id }) => {
      try {
        const task = tasksV2.find(task => task.id === parseInt(id));
        if (!task) {
          return {
            success: false,
            task: null,
            error: createError('NOT_FOUND', `Task with ID ${id} not found`)
          };
        }
        return {
          success: true,
          task
        };
      } catch (error) {
        return {
          success: false,
          task: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    },
    tasksByTag: (_, { tag }) => {
      try {
        const filteredTasks = tasksV2.filter(task => task.tags.includes(tag));
        return {
          success: true,
          tasks: filteredTasks
        };
      } catch (error) {
        return {
          success: false,
          tasks: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    }
  },
  Mutation: {
    createTask: (_, { input }) => {
      // Validierung direkt am Anfang
      if (!input.title || input.title.trim().length === 0) {
        throw new ValidationError('Title cannot be empty');
      }

      if (!input.description || input.description.trim().length === 0) {
        throw new ValidationError('Description cannot be empty');
      }

      if (input.title.length > 100) {
        throw new ValidationError('Title cannot be longer than 100 characters');
      }

      try {
        const newTask = {
          id: Math.max(...tasksV2.map(t => t.id)) + 1,
          ...input,
          tags: input.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        tasksV2.push(newTask);
        return {
          success: true,
          task: newTask
        };
      } catch (error) {
        throw new GraphQLError('Failed to create task', {
          extensions: {
            code: 'INTERNAL_ERROR',
            error: error.message
          }
        });
      }
    },
    updateTask: (_, { id, input }) => {
      try {
        const task = tasksV2.find(t => t.id === parseInt(id));
        if (!task) {
          return {
            success: false,
            task: null,
            error: createError('NOT_FOUND', `Task with ID ${id} not found`)
          };
        }

        Object.assign(task, input);
        task.updatedAt = new Date().toISOString();

        return {
          success: true,
          task
        };
      } catch (error) {
        return {
          success: false,
          task: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    },
    deleteTask: (_, { id }) => {
      try {
        const index = tasksV2.findIndex(t => t.id === parseInt(id));
        if (index === -1) {
          return {
            success: false,
            error: createError('NOT_FOUND', `Task with ID ${id} not found`)
          };
        }

        tasksV2.splice(index, 1);
        return {
          success: true
        };
      } catch (error) {
        return {
          success: false,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    },
    addTag: (_, { id, tag }) => {
      try {
        const task = tasksV2.find(t => t.id === parseInt(id));
        if (!task) {
          return {
            success: false,
            task: null,
            error: createError('NOT_FOUND', `Task with ID ${id} not found`)
          };
        }

        if (!task.tags.includes(tag)) {
          task.tags.push(tag);
          task.updatedAt = new Date().toISOString();
        }

        return {
          success: true,
          task
        };
      } catch (error) {
        return {
          success: false,
          task: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    },
    removeTag: (_, { id, tag }) => {
      try {
        const task = tasksV2.find(t => t.id === parseInt(id));
        if (!task) {
          return {
            success: false,
            task: null,
            error: createError('NOT_FOUND', `Task with ID ${id} not found`)
          };
        }

        const tagIndex = task.tags.indexOf(tag);
        if (tagIndex !== -1) {
          task.tags.splice(tagIndex, 1);
          task.updatedAt = new Date().toISOString();
        }

        return {
          success: true,
          task
        };
      } catch (error) {
        return {
          success: false,
          task: null,
          error: createError('INTERNAL_ERROR', error.message)
        };
      }
    }
  }
};

const resolvers = {
  Query: {
    v1: () => ({}),
    v2: () => ({})
  },
  Mutation: {
    v1: () => ({}),
    v2: () => ({})
  },
  V1Query: v1Resolvers.Query,
  V1Mutation: v1Resolvers.Mutation,
  V2Query: v2Resolvers.Query,
  V2Mutation: v2Resolvers.Mutation
};

module.exports = resolvers; 