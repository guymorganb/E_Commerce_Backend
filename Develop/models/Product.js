// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}
// set up fields and rules for Product model
Product.init(
  {
    // this object defines the attributes of the table sequelize is connecting to inside the sql database
   id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
   },
   product_name: {
    type: DataTypes.STRING,
    allowNull: false,
   }, 
   price: {
    type: DataTypes.DECIMAL(10,2), // be sure to set the precision same as sql in this case (10,2)
    allowNull: false,
    validate: {   // dont forget to validate that its a decimal
      isDecimal: true,
    },
   },
   stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10, // dont forget the default values
    validate: {    // dont forget to validate that its a number
      isNumeric: true,
    },
   },
   category_id: {
    type: DataTypes.INTEGER,
    // include the references to the 
    references: {
      model: 'category', // 'category' refers to the table name
      key: 'id',  // 'id' refers to the column name in category table    
    },
   },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
