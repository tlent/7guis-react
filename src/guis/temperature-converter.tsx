import { useState } from "react";

enum TemperatureScale {
  Celsius,
  Fahrenheit,
}

export default function TemperatureConverter() {
  const [temperature, setTemperature] = useState({
    value: 0,
    scale: TemperatureScale.Celsius,
  });
  const celsiusTemperature =
    temperature.scale === TemperatureScale.Celsius
      ? temperature.value
      : round(fahrenheitToCelsius(temperature.value));
  const fahrenheitTemperature =
    temperature.scale === TemperatureScale.Fahrenheit
      ? temperature.value
      : round(celsiusToFahrenheit(temperature.value));

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    scale: TemperatureScale
  ) {
    const value = event.target.valueAsNumber;
    setTemperature({ value, scale });
  }

  return (
    <>
      <input
        type="number"
        value={celsiusTemperature}
        className={"w-20 rounded-md p-1"}
        onChange={(event) => handleChange(event, TemperatureScale.Celsius)}
      />{" "}
      Celsius ={" "}
      <input
        type="number"
        value={fahrenheitTemperature}
        className={"w-20 rounded-md p-1"}
        onChange={(event) => handleChange(event, TemperatureScale.Fahrenheit)}
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
