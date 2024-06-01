"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import "@fortawesome/fontawesome-free/css/all.css";

function WeatherDetails() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  console.log(city, lat, lon);
  const [weatherData, setWeatherData] = useState<any>(null);

  async function fetchData(location: {city?: string, lat?: string, lon?: string}) {
    try {
      let url;
      if (location.city) {
        url = `http://localhost:3000/api/weather?address=${location.city}`;
      } else if (location.lat && location.lon) {
        url = `http://localhost:3000/api/weather?lat=${location.lat}&lon=${location.lon}`;
      } else {
        throw new Error('Invalid location data');
      }
      const res = await fetch(url);
      const jsonData = (await res.json()).data;
      if (res.ok) {
        setWeatherData(jsonData);
        console.log(jsonData);
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
      fetchData({ city });
    } else if (lat && lon) {
      fetchData({ lat, lon });
    }
  }, [city, lat, lon]);

  return (
    <div className="container mx-auto p-6">
      <Link href="/" className="text-[#353535] hover:underline"><i className='fa fa-arrow-left'></i> Go back</Link>
      <h1 className="text-4xl font-bold mt-8 mb-8">Weather Details: {weatherData?.name}</h1>
      {weatherData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-4">
          <div className="flex flex-col gap-4 md:col-span-2 md:flex md:flex-col md:gap-4">
            <Card title="Weather" className="bg-[#FBA92C] p-4 flex flex-row items-center justify-center slide-in">
              <p className='font-bold text-2xl'>{(weatherData.weather[0].description)[0].toUpperCase() + (weatherData.weather[0].description).slice(1)}</p>
              <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="h-24 w-24 sm:h-44 sm:w-44"
                  />
            </Card>
            <Card title="Wind" className="bg-[#FBA92C] flex flex-col items-start sm:items-center justify-center p-4 gap-4 text-2xl font-bold slide-in">
              <div className='flex flex-row items-center'>
                <i className='fa fa-wind text-4xl mr-2'></i>
                <p className="font-bold">Speed:</p>
                <p>{weatherData.wind.speed} m/s</p>
              </div>
              <div className='flex flex-row items-center'>
                <i className='fas fa-compass text-4xl mr-2'></i>
                <p className="font-bold">Direction:</p>
                <p>{weatherData.wind.deg}°</p>
              </div>
              <div className='flex flex-row items-center'>
                <i className='fas fa-wind text-4xl mr-2'></i>
                <p className="font-bold">Gust:</p>
                <p>{weatherData.wind.gust} m/s</p>
              </div>
            </Card>
          </div>
          <Card title="Main" className="bg-[#FBA92C] p-4 text-2xl font-bold flex flex-col gap-6 slide-in3">
            <div className='flex flex-row items-center justify-start'>
              <i className='fas fa-thermometer-full text-4xl mr-2'></i>
              <p className="font-bold">Temperature: {weatherData.main.temp} K</p>
            </div>
            <div className='flex flex-row items-center justify-start'>
              <i className='fas fa-temperature-quarter text-4xl mr-2'></i>
              <p className="font-bold">Feels Like: {weatherData.main.feels_like} K</p>
            </div>
            <div className='flex flex-row items-center justify-start'>
              <i className='fas fa-temperature-low text-4xl mr-2'></i>
              <p className="font-bold">Min Temperature: {weatherData.main.temp_min} K</p>
            </div>
            <div className='flex flex-row items-center justify-start'>
              <i className='fas fa-temperature-high text-4xl mr-2'></i>
              <p className="font-bold">Max Temperature: {weatherData.main.temp_max} K</p>
            </div>
            <div className='flex flex-row items-center justify-start'>
              <i className='fas fa-tachometer-alt text-4xl mr-2'></i>
              <p className="font-bold">Pressure: {weatherData.main.pressure} hPa</p>
            </div>
            <div className='flex flex-row items-center justify-start'>
              <i className='fas fa-tint text-4xl mr-2'></i>
              <p className="font-bold">Humidity: {weatherData.main.humidity}%</p>
            </div>
          </Card>
        </div>
      ) : (
        <span>Loading weather data...</span>
      )}
    </div>
  );
}

function WeatherDetailsWithSuspense() {
  return (
    <Suspense>
      <WeatherDetails />
    </Suspense>
  );
}

export default WeatherDetailsWithSuspense;
