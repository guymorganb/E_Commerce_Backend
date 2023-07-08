const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tagData = await Tag.findAll({
      include: [
        {model: Product, through: ProductTag},  // this is the equvalent of joining the tables we use the 'through' because there is no foreign key association directly insde the product or the tag (we are connecting the product to tag through the product tag)
      ]
    })
    if(!tagData){
      res.status(200).json({message: 'there are no tags'});
      return;
    }
    res.status(200).json(tagData);
  }catch(err){
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    // this is the data we will send back if it exists
    const tagData = await Tag.findByPk(req.params.id,{
      include: [
        {model: Product, through: ProductTag}, // this is the equvalent of joining the tables we use the 'through' because there is no foreign key association directly insde the product or the tag (we are connecting the product to tag through the product tag)
      ]
    })
    if(!tagData){
      res.status(404).json({message: 'not tag for that id'})
      return;
    }
    res.status(200).json(tagData)
  }catch(err){
    res.status(500).json(err)
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  /* req.body should look like this...
    {
      "tag_name": "computers",
    }
  */
    try{
      if(!req.body.tag_name || typeof req.body.tag_name !== 'string'){
        res.status(400).send('The tag name is required and should be a string')
        return;
      }
      const newTag = await Tag.create({
        tag_name: req.body.tag_name,
      })
      res.status(200).json(newTag)
    }catch(err){
      res.status(400).json(err)
    }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    if(!req.body.tag_name || !req.params.id){
      res.status(400).send('Tag name and id is required')
      return
    }
    const tagData = await Tag.findByPk(req.params.id);
    if(!tagData){
      res.status(404).json({message: 'no category found with this id.'})
      return;
    }

    const updateTagName = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where:{
          id: req.params.id,
        },
      }
    )
    // update method returns an array where the first element is the number of affected rows. 
    // This is useful to know if your update operation was successful or not.
    if(updateTagName[0] === 0){
      res.status(200).json({ message: 'There is nothing to update'});
      return;
    }
    res.status(200).json({ message: 'Tag successfully updated'})
  }catch(err){
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try{
    const tagById = await Tag.findOne({
      where: {
        id: req.params.id,
      }
    });
    if(!tagById){
      res.status(404).json('There is no tag by that id')
      return;
    }
    await Tag.destroy({
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(tagById)  
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
