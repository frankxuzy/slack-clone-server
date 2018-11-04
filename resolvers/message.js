import { PubSub, withFilter } from 'graphql-subscriptions';
import { requiresAuth } from '../utils/utils';

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channel_id === args.channel_id,
      ),
    },
  },
  Message: {
    // eslint-disable-next-line
    user: ({user_id}, args, { models }, info) => (models || info.rootValue.context.models).User.findOne({
      where: { id: user_id },
      raw: true,
    }),
  },
  Query: {
    messages: requiresAuth.createResolver(async (
      parent,
    // eslint-disable-next-line
      { channel_id },
      { models },
    ) => models.Message.findAll({ order: [['created_at', 'ASC']], where: { channel_id }, raw: true })),
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const message = await models.Message.create({
          ...args,
          user_id: user.id,
        });
        pubsub.publish(NEW_CHANNEL_MESSAGE, {
          channel_id: args.channel_id,
          newChannelMessage: message.dataValues,
          context: { models },
        });
        return true;
      } catch (err) {
        return false;
      }
    }),
  },
  // Query: {
  //   getChannel: async (parent, { models }) => {
  //     try {
  //       return await models.Message.find();
  //     } catch (err) {
  //       console.log(err);
  //       return false;
  //     }
  //   },
  // },
};
