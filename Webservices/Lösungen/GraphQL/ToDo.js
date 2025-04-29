const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { readFileSync } = require('fs');
const resolvers = require('./resolvers');

const app = express();
app.use(express.json());

let tasks = [
  { id: 1, title: "Einkaufen gehen", description: "Milch, Brot, Eier kaufen", completed: false },
  { id: 2, title: "Lernen", description: "GraphQL und REST verstehen", completed: true },
  { id: 3, title: "Joggen", description: "5km Runde", completed: false }
];

async function startServer() {
  const typeDefs = readFileSync('./schema.graphql', 'utf-8');
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => {
      // Log des Original-Fehlers für Debugging
      console.error('Original error:', error);

      // Angepasste Fehlerformatierung
      return {
        message: formattedError.message,
        code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
        locations: formattedError.locations,
        path: formattedError.path,
        // Zusätzliche Felder für Entwickler im Development-Mode
        ...(process.env.NODE_ENV === 'development' && {
          stacktrace: formattedError.extensions?.exception?.stacktrace
        })
      };
    },
    // Plugin für zusätzliche Fehlerbehandlung
    plugins: [{
      requestDidStart() {
        return {
          willSendResponse({ response }) {
            // Fehler in einheitliches Format bringen
            if (response.errors) {
              response.errors = response.errors.map(err => ({
                message: err.message,
                code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
                path: err.path
              }));
            }
          }
        };
      }
    }]
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server));

  app.listen(5000, () => {
    console.log('GraphQL Server läuft auf http://localhost:5000/graphql');
  });
}

startServer();
