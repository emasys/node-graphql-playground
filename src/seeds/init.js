// eslint-disable-next-line import/prefer-default-export
export const createUsersWithMessages = async (models) => {
  await models.User.create(
    {
      username: 'emasys',
      email: 'emasys@emasys.com',
      password: 'password',
      messages: [
        {
          text: 'just testing out this stuff',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'jonDoe',
      email: 'johnny@example.com',
      password: 'password',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
