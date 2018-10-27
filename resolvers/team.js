import { formatErrors, requiresAuth } from '../utils/utils';

export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      (parent, args, { models, user }) => models.Team.findAll({ where: { owner: user.id } }, { raw: true }),
    ),
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const newTeam = await models.Team.create({ ...args, owner: user.id });
        await models.Channel.create({
          name: 'general',
          public: true,
          team_id: newTeam.id,
        });
        return {
          team: newTeam,
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
    channels: (parent, args, { models }) => models.Channel.findAll({ where: { team_id: parent.id } }),
  },
};
