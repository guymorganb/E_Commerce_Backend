const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
  const categoryData = await Category.findAll({
    include: [
      {model: Product, required: true}
    ],
  });
  
  res.status(200).json(categoryData);
  
  }catch(err){
    res.status(500).json({message: "Connection error", Error: err})
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{    //Search for a single instance by its primary key.
    const categoryData = await Category.findByPk(req.params.id,{
      include: [{model: Product, required: true}],
    });
    if(!categoryData){
      res.status(404).json({ message: "No category found with that id"});
      return;
    }
    res.status(200).json(categoryData)
  }catch(err){
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  // create a new category
    /* req.body should look like this...
    {
      "category_name": "Basketball",
    }
  */
  try{
    if(!req.body.category_name || typeof req.body.category_name !== 'string'){        // validate that there is a category name
      res.status(400).send('The category name is required and should be a string');
      return;
    }
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json(newCategory);
  }catch(err){
    res.status(400).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    if(!req.body.category_name || !req.params.id){
      return res.status(400).send("Category name and id is required");
    }
    // Check if the category exists before attempting to update it
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'No category found with this id!'});
    }

    const updatedRows = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    // update method returns an array where the first element is the number of affected rows. 
    // This is useful to know if your update operation was successful or not.
    if (updatedRows[0] === 0) {
      return res.status(200).json({ message: 'There is nothing to update.'});
    }
    res.status(200).json({ message: 'Category updated successfully.'});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
     // check to see if it exists
    const category = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!category) {
      res.status(404).json({ message: 'No category found with that id.'});
      return;
    }
    // if it exists delete it
    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    // return the deleted category data
    res.status(200).json(category);
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
