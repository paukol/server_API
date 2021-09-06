const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  let item = Math.floor(Math.random() * db.testimonials.length);
  res.json(db.testimonials[item]);
});

router.route('/testimonials/:id').get((req, res) => {
  res.json(db.testimonials.find(item => item.id === req.params.id));
});

router.route('/testimonials').post((req, res) => {
  const testimonial ={
    id: uuidv4(),
    author: req.body.author,
    text: req.body.text
  }
  db.testimonials.push(testimonial);
  return res.json({
    message: 'ok'
  });
});

router.route('/testimonials/:id').put((req, res) => {
  db.testimonials.forEach(testimonial => {
    if(testimonial.id === req.params.id && testimonial.id) {
      testimonial.author = req.body.author;
      testimonial.text = req.body.text;
      return res.json({
        message: 'ok'
      });
    } else req.status(404).json({ message: 'Not found...' });  
  })
});

router.route('/testimonials/:id').delete((req, res) => {
  db.testimonials.forEach(testimonial => {
    if(testimonial.id && testimonial.id === req.params.id) {
      const index = db.testimonials.indexOf(testimonial);
      db.testimonials.splice(index, 1);
      return res.json({
        message: 'ok'
      });
    }
  });
  res.status(404).json({ message: 'Not found...' });
});

module.exports = router;