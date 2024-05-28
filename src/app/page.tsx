"use client";
import { useEffect, useState } from "react";
import "./page.module.css";
import { Input } from "@/components/ui/input";
function getCurrentDate() {
  const currentDate = new Date();
  const options = {month:"long"};
  const monthName = currentDate.toLocaleDateString("en-IN", options);
  const date = new Date().getDate() + ", " + monthName;
  return date;
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
      <article>
        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <>
            <div className="p-8 flex flex-col gap-2 bg-violet-700 text-white w-[25rem] rounded-2xl transition-shadow hover:shadow-2xl shadow-xl shadow-sm">
              <Input value={'Delhi'} />
              <div className="my-8 flex flex-row items-center justify-between">
              {weatherData?.weather[0]?.description === "rain" ||
                weatherData?.weather[0]?.description === "fog" ? (
                  <i
                    className={`wi wi-day-${weatherData?.weather[0]?.description} text-8xl`}
                  ></i>
                ) : (
                  <i className="wi wi-day-cloudy text-8xl font-bold"></i>
                )}
                <div className="flex flex-col gap-1 text-end">
                  <span className="text-5xl font-bold">{weatherData?.name} </span>
                  <span>{(weatherData?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176)} </span>
                </div>
              </div>
              <span>{weatherData?.weather[0]?.description?.toUpperCase()} </span>
              <span>{date}</span>
            </div>
          </>
        ) : (
          <div className="text-xl">Loading...</div>
        )}
      </article>
    </main>
  );
}
