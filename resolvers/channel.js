import { formatErrors, requiresAuth } from '../utils/utils';

export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const team = await models.Team.findOne({ where: { id: args.team_id } }, { raw: true });
        if (team.owner !== user.id) {
          return {
            ok: false,
            errors: [
              {
                path: 'name',
                message: 'You do not have rights to create channels',
              },
            ],
          };
        }
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
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
