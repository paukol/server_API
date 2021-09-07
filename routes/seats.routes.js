const express = require('express');
const router =express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.route('/seats').get((req, res) => {
    res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
    const item = db.seats.find(seat => seat.id === req.params.id);
    if(item) res.json(item);
    else res.status(404).json({ message: 'Not found...' });
});

router.route('/seats').post((req, res) => {
    const seat ={
        id: uuidv4(),
        day: req.body.day,
        seat: req.body.seat,
        client: req.body.client,
        email: req.body.email
    };
    if(db.seats.some(chosenSeat => (chosenSeat.day == req.body.day && chosenSeat.seat == req.body.seat))) {
      return res.status(404).json({message:  "The slot is already taken..."});
    } else {
      db.seats.push(seat);
      return res.json(db.seats);
    }
});

router.route('/seats/:id').delete((req, res) => {
    db.seats.forEach(seat => {
      if(seat.id && seat.id === req.params.id) {
        const index = db.seats.indexOf(seat);
        db.seats.splice(index, 1);
        return res.json({
          message: 'ok'
        });
      }
    });
    res.status(404).json({ message: 'Not found...' })
});

router.route('/seats/:id').put((req, res) => {
    db.seats.forEach(seat => {
      if(seat.id && seat.id === req.params.id) {
        seat.day = req.body.day;
        seat.seat = req.body.seat;
        seat.client = req.body.client;
        seat.email = req.body.email;
        return res.json({
          message: 'ok'
        });
      }
    });
    res.status(404).json({ message: 'Not found...' });
});

module.exports = router;