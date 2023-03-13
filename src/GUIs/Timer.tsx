import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Timer({
  initialTimerDuration = 10,
  tickInterval = 100,
}: {
  initialTimerDuration: number;
  tickInterval: number;
}) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerDuration, setTimerDuration] = useState(initialTimerDuration);

  const timerShouldRun = elapsedTime < timerDuration;

  useEffect(() => {
    if (!timerShouldRun) {
      return;
    }

    let prevTickTime = Date.now();
    const id = setInterval(tick, tickInterval);

    function tick() {
      const now = Date.now();
      const dt = (now - prevTickTime) / 1000;
      prevTickTime = now;
      setElapsedTime((t) => Math.min(t + dt, timerDuration));
    }

    return () => {
      clearInterval(id);
    };
  }, [tickInterval, timerShouldRun, timerDuration]);

  return (
    <>
      <progress max={timerDuration} value={elapsedTime}></progress>
      <p>Elapsed time: {Math.round(elapsedTime * 100) / 100}s</p>
      <input
        type="range"
        value={timerDuration}
        onChange={(e) => setTimerDuration(e.target.valueAsNumber)}
      />
      <p>Timer duration: {timerDuration}s</p>
      <Button onClick={() => setElapsedTime(0)}>Reset</Button>
    </>
  );
}
