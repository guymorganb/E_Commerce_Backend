// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection.js');
// Initialize Category model (table) by extending off Sequelize's Model class
class Category extends Model {}
// set up fields and rules for Category model (These should match up with you schema.sql)
Category.init(
  {
    // this object defines the attributes of the table sequelize is connecting to inside the sql database
    id: {
      // define columns
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  // must be a second argument of the init() command not part of the object that defines the attributes of the table
  {
    sequelize,
    timestamps: false,  // This disables the createdAt and updatedAt timestamps that Sequelize automatically adds to models by default.
    freezeTableName: true, // This prevents Sequelize from pluralizing the model name to create the table name.
    underscored: true,  // This makes the auto-generated fields of createdAt and updatedAt (if you didn't disable timestamps) become created_at and updated_at, which is more aligned with SQL's convention.
    modelName: 'category',  // modelName: The name of the model. Sequelize uses this to create the name of the table in the database.
  }
);

module.exports = Category;
