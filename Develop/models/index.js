// in this file we are defining the relationships between the tables

// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE', // if Category row is deleted, delete the associated Product row.
  onUpdate: 'CASCADE' // if Category id is updated, update the associated Product row.
});
// This creates the FOREIGN KEY constraint on category_id in the Product table, 
// similar to what you've defined in your SQL schema.
//------------------------------------------------------------
// Categories have many Products
Category.hasMany(Product,{
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
})
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  // as: 'tags', // this alias is used in queries
  foreignKey: 'product_id',
  //otherKey: 'tag_id',  //In Sequelize, when you define a many-to-many relationship with the belongsToMany method, the otherKey option specifies the foreign key for the model that you're joining through.
  // onDelete: 'CASCADE',
  // onUpdate: 'CASCADE',
});
// Tags belongToMany Products (through ProductTag)

Tag.belongsToMany(Product, {
  through: ProductTag,
  // as: 'products',   // this alias is used in queries
  foreignKey: 'tag_id',
  // otherKey: 'product_id',  //ProductTag is the "join table" or "junction table" that links the two sides of the many-to-many relationship.
  // onDelete: 'CASCADE',
  // onUpdate: 'CASCADE'
})
// This sets up a many-to-many relationship between Product and Tag. 
// The through option tells Sequelize to use the ProductTag model as the junction table. 
// The as option creates an alias for the association, which you can use in queries. 
// The foreignKey specifies the column that holds the foreign key in the junction table.

// After setting up these associations, Sequelize will provide you with additional 
// methods on your models for querying and manipulating associated data. 
// For example, you can now use Product.getTags(), Product.addTag(), Tag.getProducts(), Tag.addProduct() and so on.


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
