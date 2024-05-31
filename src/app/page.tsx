"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons"; 
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import '@fortawesome/fontawesome-free/css/all.css';


function getCurrentDate() {
  const currentDate = new Date();
  const options = { month: "long" };
  const monthName = currentDate.toLocaleDateString("en-IN", options);
  const date = new Date().getDate() + ", " + monthName;
  return date;
}

export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  async function fetchDataCity(cityName: string) {
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
          fetchDataCity("Delhi");
        }
      );
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <article>
        <Tabs defaultValue="city">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="city">City</TabsTrigger>
            <TabsTrigger value="coords">Coordinates</TabsTrigger>
          </TabsList>
          <TabsContent value="city">
            <div className="p-8 flex flex-col gap-2 bg-gradient-to-br from-violet-500 to-violet-900 text-white w-full rounded-2xl transition-shadow hover:shadow-4xl">
              <form className="flex flex-row gap-4" onSubmit={(e) => {
                e.preventDefault();
                fetchDataCity(city);
              }}>
                <Input placeholder="Enter the location" onChange={(e) => setCity(e.target.value)} value={city} />
                <Button>Search</Button>
              </form>
              {weatherData && weatherData.weather && weatherData.weather[0] ? (
                <div>
                  <div className="my-8 flex flex-row gap-8 items-center justify-between">
                  <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="h-24 w-24 sm:h-32 sm:w-32"
                  />
                  <div className="flex flex-col gap-1 text-end">
                    <span className="text-4xl sm:text-5xl font-bold">{(weatherData.main.temp - 273.15).toFixed(2) + String.fromCharCode(176) + "C"} </span>
                    <span>{weatherData.weather[0].description.toUpperCase()} </span>
                  </div>
                  </div>
                  <div>
                  <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex flex-col text-xl">
                  <span>{weatherData?.name}</span>
                  <span>{date}</span>
                </div>
                <div>
                <Button
                variant={"secondary"}
                disabled={!city}
                className="gap-2 items-center"
              >
                <Link
                  href={{
                    pathname: "/weather-details",
                    query: { city: city },
                  }}
                >
                  <span>More </span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
                </Button>
                </div>
              </div>
                  </div>
                </div>
              ): (
                <div className="flex flex-col text-4xl font-bold items-center m-4 gap-4">
                  <span>Loading...</span>
                  <ReloadIcon className="h-8 w-8 fa-spin"/>
                </div>
              )}

            </div>
          </TabsContent>
          <TabsContent value="coords">
            <div className="p-8 flex flex-col gap-2 bg-gradient-to-br from-violet-500 to-violet-900 text-white w-full rounded-2xl transition-shadow hover:shadow-4xl">
              <form
                className="flex sm:flex-row flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchDataCoords(latitude, longitude); // Call fetchDataCoords with latitude and longitude
                }}
              >
                <Input
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="sm:w-1/3 w-full"
                />
                <Input
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="sm:w-1/3 w-full"
                />
                <Button disabled={!latitude || !longitude} className="sm:w-1/3 w-full">Get Weather</Button> {/* Disable button if latitude or longitude is empty */}
              </form>
              {weatherData && weatherData.weather && weatherData.weather[0] ? (
                <div>
                  <div className="my-8 flex flex-row gap-8 items-center justify-between">
                    <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                      alt={weatherData.weather[0].description}
                      className="h-24 w-24 sm:h-32 sm:w-32"
                    />
                    <div className="flex flex-col gap-1 text-end">
                      <span className="text-4xl sm:text-5xl font-bold">{(weatherData.main.temp - 273.15).toFixed(2) + String.fromCharCode(176) + "C"} </span>
                      <span>{weatherData.weather[0].description.toUpperCase()} </span>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center gap-4">
                  <div className="flex flex-col text-xl">
                    <span>{weatherData?.name}</span>
                    <span>{date}</span>
                  </div>
                  <div>
                    <Button variant={"secondary"} 
                    className="gap-2 items-center"
                    disabled={(!latitude || !longitude)}>
                      <Link href={{ pathname: '/weather-details', query: { lat: latitude, lon: longitude } }}>
                        <span>More </span><i className="fas fa-arrow-right"></i>
                      </Link>
                    </Button>
                  </div>
                </div>
                </div>
              ): (
                <div className="flex flex-col text-4xl font-bold items-center m-4 gap-4">
                  <span>Loading...</span>
                  <ReloadIcon className="h-8 w-8 fa-spin"/>
                </div>
              )}

            </div>
          </TabsContent>
        </Tabs>
      </article>
    </main>
  );
}
