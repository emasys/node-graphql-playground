import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const {
    id, email, username, role,
  } = user;
  const response = await jwt.sign(
    {
      role,
      id,
      email,
      username,
    },
    secret,
    { expiresIn },
  );

  return response;
};

export default {
  Query: {
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      const response = await models.User.findById(me.id);
      return response;
    },
    user: async (parent, { id }, { models }) => {
      const response = await models.User.findById(id);
      return response;
    },
    users: async (parent, args, { models }) => {
      const users = await models.User.findAll();
      return users;
    },
  },
  Mutation: {
    signUp: async (parent, { username, email, password }, { models, secret }) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });
      const { newUsername, id, role } = user;
      return { token: createToken({ newUsername, id, role }, secret, '30m') };
    },
    signIn: async (parent, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }
      const {
        username, id, email, role,
      } = user;
      return {
        token: createToken({
          username, role, id, email,
        }, secret, '30m'),
      };
    },
    deleteUser: combineResolvers(isAdmin, async (parent, { id }, { models }) => {
      const response = await models.User.destroy({
        where: { id },
      });
      return response;
    }),

  },
  User: {
    messages: async (user, args, { models }) => {
      const response = await models.Message.findAll({
        where: user.id,
      });
      return response;
    },
  },
};
