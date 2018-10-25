export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
        await models.Channel.create(args);
        return true;
      } catch (err) {
        return false;
      }
    },
  },
  Query: {
    getChannel: async (parent, { id }, { models }) => {
      try {
        return await models.Channel.findOne({ where: { id } });
      } catch (err) {
        return false;
      }
    },
  },
};
