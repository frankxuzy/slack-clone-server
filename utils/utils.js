import _ from 'lodash';

export const formatErrors = (err, models) => {
  if (err instanceof models.sequelize.ValidationError) {
    return err.errors.map(val => _.pick(val, ['path', 'message']));
  }
  console.log(err);
  return [{ path: 'name', message: 'database error' }];
};

const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requiresAuth = createResolver((parent, args, { user }) => {
  if (!user || !user.id) {
    throw new Error('Not authenticated');
  }
});

// export const requiresAdmin = requiresAuth.createResolver((parent, args, context) => {
//   if (!context.user.isAdmin) {
//     throw new Error('Requires admin access');
//   }
// });
