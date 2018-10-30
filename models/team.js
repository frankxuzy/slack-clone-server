export default (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          args: [4, 30],
          msg: 'The team name length can only between 4 and 25 characters long',
        },
      },
    },
  });

  Team.associate = (models) => {
    // M to N
    Team.belongsToMany(models.User, {
      through: models.Member,
      foreignKey: 'team_id',
    });
    // 1 to N
    Team.belongsTo(models.User, {
      foreignKey: 'owner',
    });
  };

  return Team;
};
