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
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server));

  app.listen(5000, () => {
    console.log('GraphQL Server läuft auf http://localhost:5000/graphql');
  });
}

startServer();
