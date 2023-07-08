const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try{
    const productData = await Product.findAll({
      include: [ // this becomes avaliable through the use of the relationships, 
        {model: Category, required: true},
        {model: Tag, required: true, through: ProductTag} //this is the equvalent of joining the tables we use the 'through' because there is no foreign key association directly insde the product or the tag (we are connecting the product to tag through the product tag)
      ]
    })

    res.status(200).json(productData);

  }catch(err){
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try{  //Search for a single instance by its primary key.
    const productData = await Product.findByPk(req.params.id,{
      include: [
        {model: Category, required: true},
        {model: Tag, required: true, through: ProductTag}, //this is the equvalent of joining the tables we use the 'through' because there is no foreign key association directly insde the product or the tag (we are connecting the product to tag through the product tag)
      ]
    })
    // validate the id
    if(!productData){
      res.status(404).json({message: "No product found by that id"})
      return;
    }
    res.status(200).json(productData);

  }catch(err){
    res.status(500).json(err)
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      "product_name": "Basketball",
      "price": 200.00,
      "stock": 3,
      "tag_id": [3, 4]
    }
  */
    if (!req.body.product_name || typeof req.body.product_name !== 'string') {
      return res.status(400).send("Product name is required and should be a string");
    }
  
    if (!req.body.price || typeof req.body.price !== 'number') {
      return res.status(400).send("Price is required and should be a number");
    }
  
    if (!req.body.stock || typeof req.body.stock !== 'number') {
      return res.status(400).send("Stock is required and should be a number");
    }
  
    if (!req.body.tag_id || !Array.isArray(req.body.tag_id)) {
      return res.status(400).send("tag_id is required and should be an array");
    }
  Product.create(req.body) // whole body is being passed
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tag_id.length) {
        const productTagIdArr = req.body.tag_id.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tag_id  && req.body.tag_id.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tag_id 
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tag_id .includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }
      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try{
    // check to see if it exists
    const productID = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if(!productID){
      res.status(404).json({message: 'No product found with that id'})
      return;
    }
    // if Product exists delete it
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    // return the deleted data with a 200 response
    res.status(200).json(productID);
  }catch(err){
    res.status(500).json(err)
  }
});

module.exports = router;
