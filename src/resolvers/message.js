import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';

export default {
  Query: {
    messages: async (parent, args, { models }) => {
      const response = await models.Message.findAll();
      return response;
    },
    message: async (parent, { id }, { models }) => {
      const response = await models.Message.findById(id);
      return response;
    },
  },
  Mutation: {
    createMessage: combineResolvers(isAuthenticated, async (parent, { text }, { me, models }) => {
      try {
        const action = await models.Message.create({
          text,
          userId: me.id,
        });
        return action;
      } catch (error) {
        throw new Error(error);
      }
    }),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        const action = await models.Message.destroy({ where: { id } });
        return action;
      },
    ),
    updateMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { text, id }, { models }) => {
        const response = await models.Message.update(
          {
            text,
          },
          {
            where: { id },
          },
        );
        return response.length > 0;
      },
    ),
  },
  Message: {
    user: async (message, args, { models }) => {
      const response = await models.Message.findById(message.id);
      return response;
    },
  },
};
