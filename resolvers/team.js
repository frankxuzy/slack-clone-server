import { formatErrors, requiresAuth } from '../utils/utils';

export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      (parent, args, { models, user }) => models.Team.findAll({ owner: user.id }, { raw: true }),
    ),
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        await models.Team.create({ ...args, owner: user.id });
        return {
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
  },
  Team: {
    channels: (parent, args, { models }) => models.Channel.findAll({ teamId: parent.id }),
  },
};
