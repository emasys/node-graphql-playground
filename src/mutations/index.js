import uuidv4 from 'uuid';

export const newMessage = (text, me, models) => {
  const id = uuidv4();
  const message = {
    id,
    text,
    userId: me.id,
  };
  // eslint-disable-next-line no-param-reassign
  models.messages[id] = message;
  models.users[me.id].messageIds.push(id);
  return message;
};

export const removeMessage = (id, { messages }) => {
  if (messages[id]) {
    delete messages[id];
    return true;
  }
  return false;
};

export const editMessage = (text, id, { messages }) => {
  if (messages[id]) {
    messages[id].text = text;
  } else {
    return null;
  }
  return true;
};
