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
  if (elapsedTime > timerDuration) {
    setElapsedTime(timerDuration);
  }

  useEffect(() => {
    if (!timerShouldRun) {
      return;
    }
    let prevTickTime = Date.now();
    const id = setInterval(tick, tickInterval);

    function tick() {
      const now = Date.now();
      setElapsedTime((t) => t + (now - prevTickTime) / 1000);
      prevTickTime = now;
    }

    return () => {
      clearInterval(id);
    };
  }, [tickInterval, timerShouldRun]);

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
