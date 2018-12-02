import express from 'express';
import log from 'fancy-log';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import resolvers from './resolvers';
import schema from './schema';
import models from './fakeDb';

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  log('Apollo Server on http://localhost:8000/graphql');
});
