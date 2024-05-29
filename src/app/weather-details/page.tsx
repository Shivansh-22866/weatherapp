"use client";
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function WeatherDetails() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');

  async function fetchData(cityName: string) {
    try {
      const res = await fetch("http://localhost:3000/api/weather?address=" + cityName);
      const jsonData = (await res.json()).data;
      return jsonData;
    } catch(err) {
      console.error(err);
    }
  }

  const WeatherDetails = fetchData(city);
  console.log(WeatherDetails);

  return (
    <div>
      <span>The user chose {city}</span>

    </div>
  );
}

export default WeatherDetails;