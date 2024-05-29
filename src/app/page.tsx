"use client";
import { useEffect, useState } from "react";
import "./page.module.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
function getCurrentDate() {
  const currentDate = new Date();
  const options = {month:"long"};
  const monthName = currentDate.toLocaleDateString("en-IN", options);
  const date = new Date().getDate() + ", " + monthName;
  return date;
}

export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState<any>(null);
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

  async function fetchDataCoords(lat: number, lon: number) {
    try {
      const res = await fetch(`http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`);
      const jsonData = (await res.json()).data;
      setWeatherData(jsonData);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    //fetchData("London");
    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataCoords(latitude, longitude);
        }, (err) => {
          console.error(err);
          fetchData("Delhi");
        }
      );
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <article>
        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <>
            <div className="p-8 flex flex-col gap-2 bg-gradient-to-br from-violet-500 to-violet-900 text-white w-full rounded-2xl transition-shadow hover:shadow-4xl">
              <form className="flex flex-row gap-4" onSubmit={(e) => {
                e.preventDefault();
                fetchData(city);
              }}>
                <Input placeholder="Enter the location" onChange={(e) => setCity(e.target.value)}/>
                <Button>Search</Button>
              </form>
              <div className="my-8 flex flex-row gap-8 items-center justify-between">
              {weatherData?.weather[0]?.description === "rain" ||
                weatherData?.weather[0]?.description === "fog" ? (
                  <i
                    className={`wi wi-day-${weatherData?.weather[0]?.description} text-8xl`}
                  ></i>
                ) : (
                  <i className="wi wi-day-cloudy text-5xl sm:text-8xl font-bold"></i>
                )}
                <div className="flex flex-col gap-1 text-end">
                  <span className="text-4xl sm:text-5xl font-bold">{(weatherData?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176) + "C"} </span>
                  <span>{weatherData?.weather[0]?.description?.toUpperCase()} </span>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex flex-col text-xl">
                  <span>{weatherData?.name}</span>
                  <span>{date}</span>
                </div>
                <div>
                  <Button variant={"secondary"} className="gap-2 items-center"><span>More</span><i className="fas fa-arrow-right"></i></Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 flex flex-col gap-2 bg-gradient-to-br from-violet-500 to-violet-900 text-white w-full rounded-2xl transition-shadow hover:shadow-4xl">Loading...</div>
        )}
      </article>
    </main>
  );
}
