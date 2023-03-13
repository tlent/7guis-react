import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Timer({
  initialTimerDuration = 10,
}: {
  initialTimerDuration?: number;
}) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerDuration, setTimerDuration] = useState(initialTimerDuration);

  const timerShouldRun = elapsedTime < timerDuration;
  if (elapsedTime > timerDuration) {
    setElapsedTime(timerDuration);
  }

  useEffect(() => {
    if (!timerShouldRun) {
      return;
    }
    let prevTickTimestamp = performance.now();
    let id = requestAnimationFrame(tick);

    function tick(timestamp: DOMHighResTimeStamp) {
      const dt = timestamp - prevTickTimestamp;
      setElapsedTime((t) => t + dt / 1000);
      prevTickTimestamp = timestamp;
      id = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(id);
    };
  }, [timerShouldRun]);

  return (
    <div className="w-40">
      <progress
        className="h-4 w-full overflow-hidden rounded-md"
        max={timerDuration}
        value={elapsedTime}
      ></progress>
      <p className="mt-1">
        Elapsed time: {Math.round(elapsedTime * 100) / 100}s
      </p>
      <input
        className="mt-4"
        type="range"
        value={timerDuration}
        min={1}
        max={60}
        onChange={(e) => setTimerDuration(e.target.valueAsNumber)}
      />
      <p className="mt-1">Timer duration: {timerDuration}s</p>
      <Button className="mt-4 w-full" onClick={() => setElapsedTime(0)}>
        Reset
      </Button>
    </div>
  );
}
