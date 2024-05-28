"use client";
import { useEffect, useState } from "react";

function getCurrentDate() {

}

export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("London");

  async function fetchData(cityName: string) {
    try {
      const res = await fetch("http://localhost:3000/api/weather?address=" + cityName);
      const jsonData = (await res.json()).data;
      setWeatherData(jsonData);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData("London");
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Weather App</h1>
    </main>
  );
}
