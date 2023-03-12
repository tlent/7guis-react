import { useState } from "react";

import {
  Counter,
  TemperatureConverter,
  FlightBooker,
  Timer,
  Crud,
  CircleDrawer,
  Cells,
} from "./GUIs";

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
    <main className="py-4 md:container md:mx-auto">
      <h1 className="mb-5 p-4 text-center text-5xl font-semibold">
        <a
          href="https://eugenkiss.github.io/7guis/"
          className="text-blue-700 underline"
        >
          7GUIs
        </a>{" "}
        with React
      </h1>
      <div className="mx-auto w-fit">
        <label htmlFor="selectedGUI" className="sr-only">
          Select a GUI
        </label>
        <select
          name="selectedGUI"
          onChange={handleChange}
          className="focus:shadow-outline w-full rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        >
          {GUIs.map(({ name }) => {
            return <option key={name}>{name}</option>;
          })}
        </select>
      </div>
      <div className="m-4 mx-auto w-fit p-4">{selectedGui.component}</div>
    </main>
  );
}
