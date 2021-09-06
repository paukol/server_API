const express = require('express');
const router =express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.route('/concerts').get((req, res) => {
    res.json(db.concerts);
});

router.route('/concerts/:id').get((req, res) => {
    const item = db.concerts.find(item => item.id === req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: 'Not found...' });
});

router.route('/concerts').post((req, res) => {
    const concert = {
      id: uuidv4(),
      performer: req.body.performer,
      genre: req.body.genre,
      price: req.body.price,
      day: req.body.day,
      image: req.body.image
    };
    db.concerts.push(concert);
    return res.json({
      message: 'ok'
    });
  });

  router.route('/concerts/:id').delete((req, res) => {
    db.concerts.forEach(concert => {
      if(concert.id && concert.id === req.params.id) {
        const index = db.concerts.indexOf(concert);
        db.concerts.splice(index, 1);
        return res.json({
          message: 'ok'
        });
      }
    });
    res.status(404).json({ message: 'Not found...' })
  });

router.route('/concerts/:id').put((req, res) => {
    db.concerts.forEach(concert => {
      if(concert.id && concert.id === req.params.id) {
        concert.performer = req.body.performer;
        concert.genre = req.body.genre;
        concert.price = req.body.price;
        concert.day = req.body.day;
        concert.image = req.body.image;
        return res.json({
          message: 'ok'
        });
      }
    });
    res.status(404).json({ message: 'Not found...' });
  });

  module.exports = router;