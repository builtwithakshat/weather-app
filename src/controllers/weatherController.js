const axios = require('axios');
const Weather = require('../models/Weather');

exports.getWeatherByCity = async (req, res) => {
  const city = req.params.city;
  try {
    // Check cache first
    let weather = await Weather.findOne({ city: city.toLowerCase() });
    if (weather && (Date.now() - weather.dataFetchedAt.getTime() < 10 * 60 * 1000)) {
      return res.json(weather);
    }

    // Fetch from WeatherAPI.com
    const response = await axios.get(process.env.WEATHER_API_URL, {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: city,
        aqi: 'yes' // optional: get air quality data
      }
    });
    const data = response.data;
    if (!data.current) {
      return res.status(404).json({ error: 'City not found or API error' });
    }

    // Save/update in DB
    const weatherData = {
      city: city.toLowerCase(),
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
      dataFetchedAt: new Date()
      // Add more fields if you want to store more info
    };

    weather = await Weather.findOneAndUpdate({ city: city.toLowerCase() }, weatherData, { upsert: true, new: true });

    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching weather data', details: err.message });
  }
};
