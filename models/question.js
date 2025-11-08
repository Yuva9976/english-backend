// models/question.js
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 'single' or 'multiple'
    type: {
      type: DataTypes.ENUM('single', 'multiple'),
      allowNull: false,
      defaultValue: 'single',
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {
    tableName: 'questions',
    underscored: true,
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
    Question.hasMany(models.Answer, { foreignKey: 'question_id', as: 'answers', onDelete: 'CASCADE' });
  };

  return Question;
};
