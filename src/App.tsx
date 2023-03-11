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

const GuiComponents: { [name: string]: JSX.Element } = {
  Counter: <Counter />,
  "Temperature Converter": <TemperatureConverter />,
  "Flight Booker": <FlightBooker />,
  Timer: <Timer />,
  CRUD: <Crud />,
  "Circle Drawer": <CircleDrawer />,
  Cells: <Cells />,
};

const GuiNames = Object.keys(GuiComponents);

export default function App() {
  const [selectedGui, setSelectedGui] = useState(GuiNames[0]);
  const content = GuiComponents[selectedGui];

  return (
    <main className="py-4 md:container md:mx-auto">
      <PageHeading />
      <GuiSelector onSelect={(guiName) => setSelectedGui(guiName)} />
      <div className="m-4 mx-auto w-fit p-4">{content}</div>
    </main>
  );
}

function PageHeading() {
  return (
    <h1 className="mb-5 p-4 text-center text-5xl font-semibold text-neutral-700">
      <a
        href="https://eugenkiss.github.io/7guis/"
        className="text-blue-700 underline"
      >
        7GUIs
      </a>{" "}
      with React
    </h1>
  );
}

function GuiSelector({ onSelect }: { onSelect: (guiName: string) => void }) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const name = event.target.value;
    onSelect(name);
  }

  return (
    <div className="mx-auto w-fit">
      <label htmlFor="selectedGUI" className="sr-only">
        Select a GUI
      </label>
      <select name="selectedGUI" onChange={handleChange}>
        {GuiNames.map((name) => {
          return (
            <option key={name} value={name}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
