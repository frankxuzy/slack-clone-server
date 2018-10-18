import bcrypt from 'bcrypt';
import { formatErrors } from '../utils/utils';

const saltRounds = 12;
export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        if (password.length < 8 || password.length > 20) {
          return {
            ok: false,
            errors: [{ path: 'password', message: 'The password length can only between 8 and 20 characters long' }],
          };
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await models.User.create({ ...otherArgs, password: hashedPassword });
        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
  },
};
