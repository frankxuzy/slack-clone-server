export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
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
  };

  return User;
};
