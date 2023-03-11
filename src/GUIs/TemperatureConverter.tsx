import { useState } from "react";

export default function TemperatureConverter() {
  const [celsiusTemperature, setCelsiusTemperature] = useState(0);
  const [fahrenheitTemperature, setFahrenheitTemperature] = useState(32);

  function handleCelsiusChange(event: React.ChangeEvent<HTMLInputElement>) {
    const celsiusTemperature = event.target.valueAsNumber;
    setCelsiusTemperature(celsiusTemperature);
    const fahrenheitTemperature = round(
      celsiusToFahrenheit(celsiusTemperature)
    );
    setFahrenheitTemperature(fahrenheitTemperature);
  }

  function handleFahrenheitChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fahrenheitTemperature = event.target.valueAsNumber;
    setFahrenheitTemperature(fahrenheitTemperature);
    const celsiusTemperature = round(
      fahrenheitToCelsius(fahrenheitTemperature)
    );
    setCelsiusTemperature(celsiusTemperature);
  }

  return (
    <>
      <input
        type="number"
        value={celsiusTemperature}
        className={"w-20 rounded-md p-1"}
        onChange={handleCelsiusChange}
      />{" "}
      Celsius ={" "}
      <input
        type="number"
        value={fahrenheitTemperature}
        className={"w-20 rounded-md p-1"}
        onChange={handleFahrenheitChange}
      />{" "}
      Fahrenheit
    </>
  );
}

function celsiusToFahrenheit(celsiusTemperature: number) {
  return (celsiusTemperature * 9) / 5 + 32;
}

function fahrenheitToCelsius(fahrenheitTemperature: number) {
  return ((fahrenheitTemperature - 32) * 5) / 9;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
