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
  const [hoveredCircleId, setHoveredCircleId] = useState<number | undefined>();
  const [selectedCircle, setSelectedCircle] = useState<Circle | undefined>();
  const currentCircles = history[historyIndex];

  function undo() {
    setHistoryIndex(Math.max(0, historyIndex - 1));
  }

  function redo() {
    setHistoryIndex(Math.min(history.length - 1, historyIndex + 1));
  }

  function handleBoxClick(event: React.MouseEvent<HTMLDivElement>) {
    const { offsetX, offsetY } = event.nativeEvent;
    const diameter = 10 + Math.random() * 50;
    const newCircle = { offsetX, offsetY, diameter, id: getNextCircleId() };
    const newHistory = [
      ...history.slice(0, historyIndex + 1),
      [...currentCircles, newCircle],
    ];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }

  function handleBoxMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;
    const offsetY = event.clientY - boundingRect.top;
    let nearestHoveredCircle: Circle | undefined;
    let minHoveredDistance: number | undefined;
    for (const circle of currentCircles) {
      const xDistance = offsetX - circle.offsetX;
      const yDistance = offsetY - circle.offsetY;
      const distance = Math.sqrt(
        Math.pow(xDistance, 2) + Math.pow(yDistance, 2)
      );
      const radius = circle.diameter / 2;
      const isHovered = distance < radius;
      const isMin =
        minHoveredDistance === undefined || distance < minHoveredDistance;
      if (isHovered && isMin) {
        nearestHoveredCircle = circle;
        minHoveredDistance = distance;
      }
    }
    setHoveredCircleId(nearestHoveredCircle?.id);
  }

  function handleCircleClick(
    event: React.MouseEvent<HTMLDivElement>,
    circle: Circle
  ) {
    event.preventDefault();
    event.stopPropagation();
    setSelectedCircle({ ...circle });
  }

  function handleDiameterRangeChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!selectedCircle) {
      throw new Error("Changed diameter with no selected circle");
    }
    setSelectedCircle({
      ...selectedCircle,
      diameter: event.target.valueAsNumber,
    });
  }

  function handleDiameterSaveClick() {
    const newHistory = [
      ...history.slice(0, historyIndex + 1),
      currentCircles.map((circle) =>
        circle.id === selectedCircle?.id ? selectedCircle : circle
      ),
    ];
    setHistory(newHistory);
    setSelectedCircle(undefined);
    setHistoryIndex(newHistory.length - 1);
  }

  let circleAdjuster: JSX.Element | undefined;
  if (selectedCircle) {
    circleAdjuster = (
      <div className="flex flex-col items-center justify-center space-y-2">
        <div>
          <label htmlFor="diameter-range" className="text-sm font-semibold">
            Adjust diameter of selected circle #{selectedCircle.id} at (
            {selectedCircle.offsetX}, {selectedCircle.offsetY})
          </label>
        </div>
        <div>
          <input
            type="range"
            id="#diameter-range"
            value={selectedCircle.diameter}
            onChange={handleDiameterRangeChange}
            min={1}
            max={100}
          />
        </div>
        <Button onClick={handleDiameterSaveClick}>Save</Button>
      </div>
    );
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
        onClick={handleBoxClick}
        onMouseMove={handleBoxMouseMove}
      >
        {currentCircles.map((circle) => {
          const { offsetX, offsetY, id } = circle;
          const diameter =
            id === selectedCircle?.id
              ? selectedCircle.diameter
              : circle.diameter;
          const classes = [
            "absolute",
            "rounded-full",
            "border",
            "border-black",
            "cursor-pointer",
          ];
          if (id === (selectedCircle?.id ?? hoveredCircleId)) {
            classes.push("bg-neutral-300", "opacity-90", "z-10");
          }
          return (
            <div
              key={id}
              style={{
                top: `calc(${offsetY}px - (${diameter}px / 2))`,
                left: `calc(${offsetX}px - (${diameter}px / 2))`,
                width: `${diameter}px`,
                height: `${diameter}px`,
              }}
              className={classes.join(" ")}
              onClick={(event) => handleCircleClick(event, circle)}
              onContextMenu={(event) => handleCircleClick(event, circle)}
            ></div>
          );
        })}
      </div>
      {circleAdjuster}
    </div>
  );
}
