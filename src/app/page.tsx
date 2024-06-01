"use client";
import { SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons"; 
import Link from "next/link";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import '@fortawesome/fontawesome-free/css/all.css';
import "./page.module.css";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"



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
  const [activeTab, setActiveTab] = useState("city");
  const [multipleWeatherData, setMultipleWeatherData] = useState<any[]>([]);

  const locations = [
    { name: "New York", coordinates: { lat: 40.7128, lon: -74.006 } },
    { name: "London", coordinates: { lat: 51.5074, lon: -0.1278 } },
    { name: "Tokyo", coordinates: { lat: 35.6895, lon: 139.6917 } },
    { name: "Paris", coordinates: { lat: 48.8566, lon: 2.3522 } },
    { name: "Sydney", coordinates: { lat: -33.8688, lon: 151.2093 } },
    { name: "Dubai", coordinates: { lat: 25.276987, lon: 55.296249 } },
    { name: "Los Angeles", coordinates: { lat: 34.052235, lon: -118.243683 } },
    { name: "Moscow", coordinates: { lat: 55.7558, lon: 37.6173 } },
  ];  

  const handleTabChange = (tabValue: SetStateAction<string>) => {
    setActiveTab(tabValue);
  };

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

  useEffect(() => {
    const fetchWeatherData = async () => {
      const weatherDataArray = await Promise.all(locations.map(async (location) => {
        try {
          let res;
          if (location.coordinates) {
            res = await fetch(`http://localhost:3000/api/weather?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
          } else {
            res = await fetch(`http://localhost:3000/api/weather?address=${location.name}`);
          }
          const jsonData = (await res.json()).data;
          return jsonData;
        } catch(err) {
          console.error(err);
          return null;
        }
      }));
      setMultipleWeatherData(weatherDataArray.filter(data => data !== null));
    };
  
    fetchWeatherData();
  }, []);
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-12">
      <h1 className="text-8xl font-bold slide-in">NextJS Weather App</h1>
      <article className="slide-in2">
        <Tabs defaultValue="city">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="city" onClick={() => handleTabChange("city")}>City</TabsTrigger>
            <TabsTrigger value="coords" onClick={() => handleTabChange("coords")}>Coordinates</TabsTrigger>
          </TabsList>
          <TabsContent value="city" className={activeTab === "city" ? "fade" : ""}>
            <div className="p-8 flex flex-col gap-2 bg-[#FBA92C] text-white w-full rounded-2xl transition-shadow hover:shadow-4xl">
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
          <TabsContent value="coords" className={activeTab === "coords" ? "fade" : ""}>
            <div className="p-8 flex flex-col gap-2 bg-[#FBA92C] text-white w-full rounded-2xl transition-shadow hover:shadow-4xl">
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
      <Card className="p-4 text-xl bg-[#FBA92C] border-[1.5rem] border-slate-700 slide-in3">
    The Next.js weather widget is a web application designed to 
    provide users with up-to-date weather information for multiple
    locations. Built using Next.js, a popular React framework, 
    this widget offers a responsive and interactive user 
    experience.
    At its core, the widget consists of several key components. 
    The main section of the widget features tabs that allow users 
    to switch between viewing weather information based on city 
    names or geographical coordinates. Users can input their 
    desired location in the corresponding input field and click 
    the &quot;Search&quot; button to retrieve weather data. Additionally, 
    if geolocation is available, the widget automatically fetches 
    weather data based on the user&lsquo;s current coordinates.
    Once weather data is retrieved, it is displayed in a visually appealing format. 
    Each location&lsquo;s weather information is presented within a 
    card-like container, featuring an icon representing the 
    current weather condition, temperature in Celsius, and a 
    brief description of the weather. Alongside this, the 
    location&lsquo;s name and the current date are displayed, providing 
    context to the weather data. Users can also click on the &quot;More&quot; 
    button to access additional weather details for the selected 
    location.
  </Card>
      <Drawer>
    <DrawerTrigger className="slide-in4">
      <div className="bg-slate-700 text-white py-2 px-4 rounded-md font-semibold">
        Open Weather Carousel
      </div>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Weather Carousel</DrawerTitle>
      </DrawerHeader>
      <div className="flex flex-row justify-center">
        <Carousel className="w-full max-w-sm slide-in">
          <CarouselContent>
            {multipleWeatherData.map((data, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col gap-2 bg-[#FB9A2C] text-white rounded-2xl transition-shadow hover:shadow-4xl">
                      <div className="my-8 flex flex-row gap-8 items-center justify-evenly">
                        <img
                          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                          alt={data.weather[0].description}
                          className="w-16 h-16 sm:h-32 sm:w-32"
                        />
                        <div className="flex flex-col gap-1 text-end">
                          <span className="text-4xl sm:text-5xl font-bold">
                            {(data.main.temp - 273.15).toFixed(2) + String.fromCharCode(176) + "C"} 
                          </span>
                          <span>{data.weather[0].description.toUpperCase()} </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center text-xl">
                        <span>{data?.name}</span>
                        <span>{date}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <DrawerFooter>
        <DrawerClose>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  <div className="p-4 text-xl bg-[#FBA92C] border-[1.5rem] border-slate-700 rounded-xl slide-in5">
  Moreover, the widget offers a convenient feature through a 
  drawer component. Users can open the drawer to reveal a 
  carousel displaying weather information for multiple 
  pre-defined locations simultaneously. Each carousel item 
  presents weather data in a similar format to the main widget, 
  allowing users to quickly glance through the weather conditions
   of various cities without leaving the current page. With its 
   intuitive design and comprehensive functionality, the Next.js 
   weather widget provides users with a seamless way to stay 
   informed about weather conditions worldwide.
  </div>

      {/* <Carousel className="w-full max-w-sm slide-in">
        <CarouselContent>
          {multipleWeatherData.map((data, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col gap-2 bg-gradient-to-br from-violet-500 to-violet-900 text-white rounded-2xl transition-shadow hover:shadow-4xl">
                    <div className="my-8 flex flex-row gap-8 items-center justify-evenly">
                      <img
                        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                        alt={data.weather[0].description}
                        className="w-16 h-16 sm:h-32 sm:w-32"
                      />
                      <div className="flex flex-col gap-1 text-end">
                        <span className="text-4xl sm:text-5xl font-bold">
                          {(data.main.temp - 273.15).toFixed(2) + String.fromCharCode(176) + "C"} 
                        </span>
                        <span>{data.weather[0].description.toUpperCase()} </span>
                      </div>
                    </div>
                      <div className="flex flex-col items-center text-xl">
                        <span>{data?.name}</span>
                        <span>{date}</span>
                      </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel> */}
    </main>
  );
}
