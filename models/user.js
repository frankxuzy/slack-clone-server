export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'The username can only contain letters and numbers',
        },
        len: {
          args: [6, 25],
          msg: 'The username length can only between 6 and 25 characters long',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: 'user_id',
    });

    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: 'user_id',
    });
  };

  return User;
};
