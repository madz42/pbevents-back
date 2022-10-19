"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class field extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  field.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      data: { type: DataTypes.TEXT, allowNull: false },
      total: { type: DataTypes.INTEGER, allowNull: false },
      owner: { type: DataTypes.INTEGER },
      preview: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "field",
    }
  );
  return field;
};
