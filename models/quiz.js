// models/quiz.js
module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // optional metadata
    timeLimitMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'quizzes',
    underscored: true,
  });

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
    Quiz.hasMany(models.Question, { foreignKey: 'quiz_id', as: 'questions', onDelete: 'CASCADE' });
  };

  return Quiz;
};
