const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// GET /api/weather/:city
router.get('/:city', weatherController.getWeatherByCity);

module.exports = router;
