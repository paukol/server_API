const express = require('express');
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});


app.use((req, res) => {
  return res.status(404).json({
    message: 'Not found...'
  });
});
// connects our backend code with the database

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if(NODE_ENV === 'production') dbUri = 'mongodb://localhost:27017/NewWaveDB';
else if(NODE_ENV === 'test') dbUri = 'mongodb://localhost:27017/NewWaveDBtest';
else dbUri = 'mongodb+srv://${process.env.GITHUB_USERNAME}:${process.env.OTHER_VAR}@cluster0.06oq9.mongodb.net/NewWaveDB?retryWrites=true&w=majority';

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to the database");
});
db.on("error", (err) => console.log("Error " + err));


const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New socket!', socket.id);
});

module.exports = server;