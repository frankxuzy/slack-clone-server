export default (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Team.associate = (models) => {
    // M to N
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: 'teamId',
    });
    // 1 to N
    Team.belongsTo(models.User, {
      foreignKey: 'owner',
    });
  };

  return Team;
};
