import { newMessage, removeMessage, editMessage } from '../mutations';

export default {
  Query: {
    messages: (parent, args, { models }) => Object.values(models.messages),
    message: (parent, { id }, { models }) => models.messages[id],
  },
  Mutation: {
    createMessage: (parent, { text }, { me, models }) => newMessage(text, me, models),
    deleteMessage: (parent, { id }, { models }) => removeMessage(id, models),
    updateMessage: (parent, { text, id }, { models }) => editMessage(text, id, models),
  },
  Message: {
    user: (message, args, { models }) => models.users[message.userId],
  },
};
