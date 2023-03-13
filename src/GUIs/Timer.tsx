import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Timer({
  initialTimerDuration = 10,
  tickInterval = 100,
}: {
  initialTimerDuration: number;
  tickInterval: number;
}) {
  const [timerDuration, setTimerDuration] = useState(initialTimerDuration);
  const [elapsedTime, setElapsedTime] = useState(0);

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
      <p>Elapsed time: {elapsedTime}</p>
      <p>Timer duration: {timerDuration}</p>
      <Button onClick={() => setElapsedTime(0)}>Reset</Button>
    </>
  );
}
