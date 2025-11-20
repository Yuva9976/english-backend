// models/quizAttempt.js
module.exports = (sequelize, DataTypes) => {
  const QuizAttempt = sequelize.define('QuizAttempt', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    quiz_id: { type: DataTypes.INTEGER, allowNull: false },
    total_points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    earned_points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    score_percent: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    details: { type: DataTypes.JSONB, allowNull: true }, // stores question-wise details
    submitted_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'quiz_attempts',
    underscored: true,
    timestamps: false,
  });

  QuizAttempt.associate = (models) => {
    QuizAttempt.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    QuizAttempt.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
  };

  return QuizAttempt;
};
