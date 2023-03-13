import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Timer({
  initialTimerDuration = 10,
  updateInterval = 100,
}: {
  initialTimerDuration: number;
  updateInterval: number;
}) {
  const [timerDuration, setTimerDuration] = useState(initialTimerDuration);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerShouldRun = elapsedTime < timerDuration;

  useEffect(() => {
    if (!timerShouldRun) {
      return;
    }

    let prevTickTime = Date.now();
    const id = setInterval(tick, updateInterval);

    function tick() {
      const now = Date.now();
      const dt = (now - prevTickTime) / 1000;
      prevTickTime = now;
      setElapsedTime((t) => {
        const newElapsedTime = t + dt;
        if (newElapsedTime > timerDuration) {
          clearInterval(id);
          return timerDuration;
        }
        return newElapsedTime;
      });
    }

    return () => {
      tick();
      clearInterval(id);
    };
  }, [updateInterval, timerDuration, timerShouldRun]);

  return (
    <>
      <p>Elapsed time: {elapsedTime}</p>
      <p>Timer duration: {timerDuration}</p>
      <Button onClick={() => setElapsedTime(0)}>Reset</Button>
    </>
  );
}
