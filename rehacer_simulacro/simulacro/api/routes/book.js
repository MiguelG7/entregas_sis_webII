const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);
const COLLECTION = 'books';

//getBooks()
router.get('/', async (req, res) => {
  let limit = MAX_RESULTS;
  if (req.query.limit){
    limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
  }
  let next = req.query.next;
  let query = {}
  if (next){
    query = {_id: {$lt: new ObjectId(next)}}
  }
  const dbConnect = dbo.getDb();
  let results = await dbConnect
    .collection(COLLECTION)
    .find(query,{
      "projection":{
        "_id":1,
        "title":1,
        "author":1
      }
    })
    .sort({_id: -1})
    .limit(limit)
    .toArray()
    .catch(err => res.status(400).send('Error searching for books'));
    // Añadir link HATEOAS
  results = results.map(book => ({
    ...book,
    link: `http://localhost:${process.env.PORT || 3000}${process.env.BASE_URI}/book/${book._id}`
  }));
  next = results.length == limit ? results[results.length - 1]._id : null;
  res.json({results, next}).status(200);
});

//getBookById()
router.get('/:id', async (req, res) => {
  const dbConnect = dbo.getDb();
  let query = {_id: new ObjectId(req.params.id)};
  let result = await dbConnect
    .collection(COLLECTION)
    .findOne(query,{
      "projection":{
        "_id":1,
        "title":1,
        "author":1
      }
    })
  if (!result){
    res.send("Not found").status(404);
  } else {
    res.status(200).send(result);
  }
});

//addBook()
router.post('/', async (req, res) => {
  const dbConnect = dbo.getDb();
  console.log(req.body);
  let result = await dbConnect
    .collection(COLLECTION)
    .insertOne(req.body);
  res.status(201).send(result);
});

//deleteBookById()
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try{
    const query = { _id: new ObjectId(req.params.id) };
    const dbConnect = dbo.getDb();

      let result = await dbConnect
        .collection(COLLECTION)
        .deleteOne(query);
      res.status(200).send(result);
  } catch{
      if(!ObjectId.isValid(id)){
        res.status(400).send('ID de book invalido')
  }

  }


});

module.exports = router;
