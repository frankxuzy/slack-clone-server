import { formatErrors } from '../utils/utils';

export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
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
