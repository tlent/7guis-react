import { useState } from "react";
import Button from "../components/button";

interface Circle {
  id: number;
  offsetX: number;
  offsetY: number;
  diameter: number;
}

let nextCircleId = 0;
function getNextCircleId() {
  return nextCircleId++;
}

export default function CircleDrawer() {
  const [history, setHistory] = useState<Circle[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const currentCircles = history[historyIndex];

  function addCircle(offsetX: number, offsetY: number) {
    const diameter = 1 + Math.random() * 4;
    const newCircle = { offsetX, offsetY, diameter, id: getNextCircleId() };
    const newHistory = [
      ...history.slice(0, historyIndex + 1),
      [...currentCircles, newCircle],
    ];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }

  function undo() {
    setHistoryIndex(Math.max(0, historyIndex - 1));
  }

  function redo() {
    setHistoryIndex(Math.min(history.length - 1, historyIndex + 1));
  }

  return (
    <div className="space-y-4 rounded border border-neutral-400 p-6 shadow">
      <div className="flex justify-center space-x-2">
        <Button onClick={undo} disabled={historyIndex === 0}>
          Undo
        </Button>
        <Button onClick={redo} disabled={historyIndex === history.length - 1}>
          Redo
        </Button>
      </div>
      <div
        className="relative h-64 w-96 overflow-clip border border-black"
        onClick={(event) => {
          const { offsetX, offsetY } = event.nativeEvent;
          addCircle(offsetX, offsetY);
        }}
      >
        {currentCircles.map(({ id, offsetX, offsetY, diameter }) => {
          return (
            <div
              key={id}
              style={{
                top: `calc(${offsetY}px - (${diameter}rem / 2))`,
                left: `calc(${offsetX}px - (${diameter}rem / 2))`,
                width: `${diameter}rem`,
                height: `${diameter}rem`,
              }}
              className={`absolute rounded-full border border-black hover:bg-neutral-400`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
