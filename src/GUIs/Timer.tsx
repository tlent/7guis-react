import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Timer({
  initialTimerDuration = 10,
}: {
  initialTimerDuration: number;
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
