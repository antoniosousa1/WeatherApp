import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Button, Alert } from 'react-bootstrap';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
    setCities(savedCities);
  }, []);

  const API_KEY = 'e14e8bc0635999637e9d86a08c19a21a';
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      if (!response.ok) {
        throw new Error('City not found. Please enter a valid city name.');
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
      updateCities(data);
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    }
  };

  const updateCities = (data) => {
    const updatedCities = [...cities, data];
    setCities(updatedCities);
    localStorage.setItem('cities', JSON.stringify(updatedCities));
  };

  const handleSearch = () => {
    if (city !== '') {
      fetchWeatherData();
    }
  };

  const handleRemoveCard = (index) => {
    const updatedCities = cities.filter((_, i) => i !== index);
    setCities(updatedCities);
    localStorage.setItem('cities', JSON.stringify(updatedCities));
  };

  const handleChangeCity = (e) => {
    setCity(e.target.value);
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Weather App</h1>
      <div className="mb-4">
        <input
          type="text"
          value={city}
          onChange={handleChangeCity}
          placeholder="Enter city name"
          className="mr-2"
        />
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
        {cities.map((cityData, index) => (
          <Card key={index} style={{ width: '18rem', margin: '10px', border: '1px solid #dee2e6' }}>
            <Card.Body>
              <Card.Title>{cityData.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Temperature: {cityData.main.temp} °C</Card.Subtitle>
              <Card.Text>Weather: {cityData.weather[0].description}</Card.Text>
              <Card.Text>Wind Speed: {cityData.wind.speed} m/s</Card.Text>
              <Card.Text>Humidity: {cityData.main.humidity} %</Card.Text>
              <Button variant="danger" onClick={() => handleRemoveCard(index)}>Remove</Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  );
};

export default WeatherApp;
