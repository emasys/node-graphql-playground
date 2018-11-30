import uuidv4 from 'uuid';
import { messages, users } from '../fakeDb';

export const newMessage = (text, me) => {
  const id = uuidv4();
  const message = {
    id,
    text,
    userId: me.id,
  };
  messages[id] = message;
  users[me.id].messageIds.push(id);
  return message;
};

export const removeMessage = (id) => {
  if (messages[id]) {
    delete messages[id];
    return true;
  }
  return false;
};

export const editMessage = (text, id) => {
  if (messages[id]) {
    messages[id].text = text;
  } else {
    return null;
  }
  return true;
};
