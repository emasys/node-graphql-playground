import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import log from 'fancy-log';
import cors from 'cors';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import resolvers from './resolvers';
import schema from './schema';
import models, { sequelize } from './models';
import { createUsersWithMessages } from './seeds/init';

const getMe = async (req) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
  return null;
};

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req }) => {
    console.log(req);
    const me = await getMe(req);
    console.log(me);
    return {
      models,
      me,
      secret: process.env.SECRET,
    };
  },
  formatError: (error) => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
    return {
      // ...error,
      message,
    };
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const eraseDb = false;
const init = async () => {
  await sequelize.sync({ force: eraseDb });
  if (eraseDb) {
    await createUsersWithMessages(models);
  }

  await app.listen({ port: 8000 }, () => {
    log('Apollo Server on http://localhost:8000/graphql');
  });
};

init();
