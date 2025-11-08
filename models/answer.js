// models/answer.js
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'answers',
    underscored: true,
  });

  Answer.associate = (models) => {
    Answer.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
  };

  return Answer;
};
