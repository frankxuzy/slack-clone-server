import _ from 'lodash';

export const formatErrors = (err, models) => {
  if (err instanceof models.sequelize.ValidationError) {
    return err.errors.map(val => _.pick(val, ['path', 'message']));
  }
  return [{ path: 'name', message: 'database error' }];
};
