import { messages, users } from '../fakeDb';
import { newMessage, removeMessage, editMessage } from '../mutations';

const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users),
    messages: () => Object.values(messages),
    message: (parent, { id }) => messages[id],
  },
  Mutation: {
    createMessage: (parent, { text }, { me }) => newMessage(text, me),
    deleteMessage: (parent, { id }) => removeMessage(id),
    updateMessage: (parent, { text, id }) => editMessage(text, id),
  },
  Message: {
    user: message => users[message.userId],
  },
  User: {
    messages: user => Object.values(messages).filter(message => message.userId === user.id),
  },
};

export default resolvers;
