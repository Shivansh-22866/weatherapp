"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-separator';

function WeatherDetails() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const [weatherData, setWeatherData] = useState(null);

  async function fetchData(cityName) {
    try {
      const res = await fetch(`http://localhost:3000/api/weather?address=${cityName}`);
      const jsonData = (await res.json()).data;
      if (res.ok) {
        setWeatherData(jsonData);
      } else {
        throw new Error(jsonData.message || 'Failed to fetch weather data');
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  useEffect(() => {
    if (city) {
      fetchData(city).then(data => {
        if (data) {
          setWeatherData(data);
        }
      });
    }
  }, [city]);

  return (
    <div>
      <h1>Weather Details: {weatherData?.name}</h1>
      {weatherData ? (
        <div className="flex flex-col gap-4 px-8">
          <Card title="Weather">
            <p>{weatherData.weather[0].description}</p>
          </Card>
          <Separator />
          <Card title="Main">
            <p>Temperature: {weatherData.main.temp} K</p>
            <p>Feels Like: {weatherData.main.feels_like} K</p>
            <p>Min Temperature: {weatherData.main.temp_min} K</p>
            <p>Max Temperature: {weatherData.main.temp_max} K</p>
            <p>Pressure: {weatherData.main.pressure} hPa</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
          </Card>
          <Separator />
          <Card title="Wind">
            <p>Speed: {weatherData.wind.speed} m/s</p>
            <p>Direction: {weatherData.wind.deg}°</p>
            <p>Gust: {weatherData.wind.gust} m/s</p>
          </Card>
        </div>
      ) : (
        <span>Loading weather data...</span>
      )}
    </div>
  );
}

export default WeatherDetails;