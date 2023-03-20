import { useState } from "react";

import {
  Cells,
  CircleDrawer,
  Counter,
  Crud,
  FlightBooker,
  TemperatureConverter,
  Timer,
} from "./guis";

const GUIs = [
  { name: "Counter", component: <Counter /> },
  { name: "Temperature Converter", component: <TemperatureConverter /> },
  { name: "Flight Booker", component: <FlightBooker /> },
  { name: "Timer", component: <Timer /> },
  { name: "CRUD", component: <Crud /> },
  { name: "Circle Drawer", component: <CircleDrawer /> },
  { name: "Cells", component: <Cells /> },
];

export default function App() {
  const [selectedGui, setSelectedGui] = useState(GUIs[0]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedGui(GUIs[event.target.selectedIndex]);
  }

  return (
    <main className="pt-4">
      <h1 className="mb-5 p-4 text-center text-5xl font-semibold">
        <a
          href="https://eugenkiss.github.io/7guis/"
          className="text-blue-700 underline"
        >
          7GUIs
        </a>{" "}
        with React
      </h1>
      <div className="mx-auto mb-4 w-fit">
        <label htmlFor="selectedGUI" className="sr-only">
          Select a GUI
        </label>
        <select
          name="selectedGUI"
          onChange={handleChange}
          className="w-56 rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        >
          {GUIs.map(({ name }) => {
            return <option key={name}>{name}</option>;
          })}
        </select>
      </div>
      {selectedGui.component}
    </main>
  );
}
