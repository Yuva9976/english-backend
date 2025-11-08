// models/progress.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Progress = sequelize.define('Progress', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    lesson_id: { type: DataTypes.INTEGER, allowNull: true },
    section_id: { type: DataTypes.INTEGER, allowNull: true },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'progress',
    underscored: true,
    timestamps: true,
  });

  return Progress;
};
