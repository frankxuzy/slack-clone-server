import { formatErrors, requiresAuth } from '../utils/utils';

export default {
  Query: {
    allTeams: requiresAuth.createResolver(
      (parent, args, { models, user }) => models.Team.findAll({ where: { owner: user.id } }, { raw: true }),
    ),
  },
  Mutation: {
    addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, { models, user }) => {
      try {
        const teamPromise = models.Team.findOne({ where: { id: teamId } }, { raw: true });
        const userToAddPromise = models.User.findOne({ where: { email } }, { raw: true });
        const [team, userToAdd] = await Promise.all([teamPromise, userToAddPromise]);
        if (!userToAdd) {
          return {
            ok: false,
            errors: [{ path: 'email', message: 'Email not found' }],
          };
        }
        if (team.owner !== user.id) {
          return {
            ok: false,
            errors: [{ path: 'email', message: "You don't have right to add members to the team" }],
          };
        }
        await models.Member.create({ user_id: userToAdd.id, team_id: teamId });
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
    createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        // transaction: if team create err or channel create err nither will be create, err will be catched.
        const response = models.sequelize.transaction(
          async () => {
            const newTeam = await models.Team.create({ ...args, owner: user.id });
            await models.Channel.create({
              name: 'general',
              public: true,
              team_id: newTeam.id,
            });
            return newTeam;
          },
        );
        return {
          team: response,
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
