require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const weatherRouter = require('./routes/weather');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/weather', weatherRouter);

// root routes
app.get('/', (req, res) => {
  res.send('Welcome to the Weather App API');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
