import { useRef } from "react";

interface WeatherData {
    temperature: number;
}

interface ApiResponse {
    current_weather: {
        temperature: number;
    };
}

async function getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  const url: string = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  try {
    const response = await fetch(url);
    const data: ApiResponse = await response.json();
    if (data.current_weather) {
      return { 
        temperature: data.current_weather.temperature
      };
    } else {
      console.error('Current weather data not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

function getClientCoordinates() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(`Error getting geolocation: ${error.message}`);
        }
      );
    } else {
      reject('Geolocation is not supported by this browser.');
    }
  });
}

function celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
}

export default function TemperatureWidget() {
    const tempWidget = useRef<HTMLDivElement>(null)

    getClientCoordinates().then((coords) => {
        getWeather(coords.latitude, coords.longitude).then((weather) =>{
            const thermometerHeight = Math.floor(6 * weather.temperature / 45)

            tempWidget.current.querySelector(".thermometer-inner-bar").style.height = `${thermometerHeight + 3}0%`

            tempWidget.current.querySelector(".celcius").textContent = `${weather.temperature} ºC`
            tempWidget.current.querySelector(".fahrenheit").textContent = `${Math.floor(celsiusToFahrenheit(weather.temperature))} ºF`
        })
    }).catch((error) => {
        console.error(error);
    });

    return (
        <div ref={tempWidget} className="widget-wrapper">
            <div className="background-blur-widget"/>
            <div className="content-temp">
                <div className="thermometer">
                    <div className="thermometer-bar"></div>
                    <div className="thermometer-inner-bar"></div>
                    <div className="thermometer-bottom"></div>
                    <div className="thermometer-inner-bottom"></div>
                </div>
                <div className="temps">
                    <h1 className="celcius">0 ºC</h1>
                    <h1 className="fahrenheit">0 ºF</h1>
                </div>
            </div>
        </div>
    )
}