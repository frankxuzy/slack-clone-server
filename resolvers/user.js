import bcrypt from 'bcrypt';

const saltRounds = 12;
export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await models.User.create({ ...otherArgs, hashedPassword });
        return true;
      } catch (err) {
        return false;
      }
    },
  },
};
