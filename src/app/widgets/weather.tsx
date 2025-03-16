const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",
    56: "Light freezing drizzle",
    57: "Heavy freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

interface WeatherData {
    temperature: number;
    weathercode: number;
}

interface ApiResponse {
    current_weather: {
        temperature: number;
        weathercode: string;
    };
}

async function getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  const url: string = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  try {
    const response = await fetch(url);
    const data: ApiResponse = await response.json();
    if (data.current_weather) {
      return { 
        weathercode: weatherCodes[data.current_weather.weathercode],
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

let lat, long


export default function weatherWidget() {
    getClientCoordinates().then((coords) => {
        getWeather(coords.latitude, coords.longitude).then((weather) =>{
            console.log(weather)
            document.querySelector(".weather-text").textContent = weather.weathercode
            document.querySelector(".weather-temp").textContent = `${weather.temperature} ºC`
        })
    }).catch((error) => {
        console.error(error);
    });

    return(
        <div className="widget-wrapper weather-widget">
            <div className="background-blur-widget"/>
            <div className="content-weather">
                <div className="weather-status-wrapper">
                    <div className="weather-status sunny">
                        <div className="sun">

                        </div>
                    </div>
                </div>
                <div className="weather-status-text">
                    <h1 className="weather-text"></h1>
                    <h2 className="weather-temp"></h2>
                </div>
            </div>
        </div>
    )
}