import { useRef, useEffect, useState } from "react"

export default function TemperatureWidget() {
  const tempWidget = useRef(null)
  const [temperature, setTemperature] = useState(0)
  const [loading, setLoading] = useState(true)

  // Function to convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32

  // Function to fetch weather data from Open-Meteo API
  const getWeather = async (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.current_weather) {
        return { temperature: data.current_weather.temperature }
      } else {
        console.error("Current weather data not found.")
        return null
      }
    } catch (error) {
      console.error("Error fetching weather data:", error)
      return null
    }
  }

  // Function to get client's current coordinates
  const getClientCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            resolve({ latitude, longitude })
          },
          (error) => {
            reject(`Error getting geolocation: ${error.message}`)
          }
        )
      } else {
        reject("Geolocation is not supported by this browser.")
      }
    })
  }

  // useEffect to handle weather data fetching and updating the UI
  useEffect(() => {
    let disconnects = []

    getClientCoordinates()
      .then((coords) => {
        getWeather(coords.latitude, coords.longitude).then((weather) => {
          if (weather) {
            setTemperature(weather.temperature)
            const thermometerHeight = Math.floor((6 * weather.temperature) / 45)

            if (tempWidget.current) {
              const thermometerInnerBar = tempWidget.current.querySelector(".thermometer-inner-bar")
              thermometerInnerBar.style.height = `${thermometerHeight + 3}0%`

              setTemperature(weather.temperature)
            }

            setLoading(false)
          }
        })
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })

    setInterval(getClientCoordinates, 10000)
    disconnects.push(() => {
      clearInterval(getClientCoordinates)
    })

    return (() => {
      disconnects.forEach(disconnect => {
        disconnect()
      })
    })
  }, [])

  return (
    <div ref={tempWidget} className="widget-wrapper">
      <div className="background-blur-widget" />
      <div className="content-temp">
        <div className="thermometer">
          <div className="thermometer-bar"></div>
          <div className="thermometer-inner-bar"></div>
          <div className="thermometer-bottom"></div>
          <div className="thermometer-inner-bottom"></div>
        </div>
        <div className="temps">
          <h1 className="celcius">{temperature} ºC</h1>
          <h1 className="fahrenheit">{Math.floor(celsiusToFahrenheit(temperature))} ºF</h1>
        </div>
      </div>
    </div>
  )
}
