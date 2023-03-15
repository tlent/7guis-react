import { useEffect, useReducer } from "react";
import Button from "../components/button";

enum ActionType {
  Tick = "tick",
  SetDuration = "set_duration",
  Reset = "reset",
}

type Action =
  | { type: ActionType.Tick; deltaTime: number }
  | { type: ActionType.SetDuration; newTimerDuration: number }
  | { type: ActionType.Reset };

interface State {
  elapsedTime: number;
  timerDuration: number;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Tick: {
      return {
        ...state,
        elapsedTime: Math.min(
          state.elapsedTime + action.deltaTime,
          state.timerDuration
        ),
      };
    }
    case ActionType.SetDuration: {
      return {
        ...state,
        timerDuration: action.newTimerDuration,
        elapsedTime: Math.min(state.elapsedTime, action.newTimerDuration),
      };
    }
    case ActionType.Reset: {
      return { ...state, elapsedTime: 0 };
    }
  }
}

interface Props {
  initialTimerDuration?: number;
}

export default function Timer({ initialTimerDuration = 10 }: Props) {
  const [state, dispatch] = useReducer(reducer, {
    elapsedTime: 0,
    timerDuration: initialTimerDuration,
  });
  const timerShouldRun = state.elapsedTime < state.timerDuration;

  useEffect(() => {
    if (!timerShouldRun) {
      return;
    }
    let previousTickTimestamp: DOMHighResTimeStamp;
    let id = requestAnimationFrame(tick);

    function tick(timestamp: DOMHighResTimeStamp) {
      if (previousTickTimestamp) {
        const deltaTime = (timestamp - previousTickTimestamp) / 1000;
        dispatch({ type: ActionType.Tick, deltaTime });
      }
      previousTickTimestamp = timestamp;
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
        max={state.timerDuration}
        value={state.elapsedTime}
      ></progress>
      <p className="mt-1">
        Elapsed time: {Math.round(state.elapsedTime * 100) / 100}s
      </p>
      <input
        className="mt-4"
        type="range"
        value={state.timerDuration}
        min={1}
        max={60}
        onChange={(event) => {
          dispatch({
            type: ActionType.SetDuration,
            newTimerDuration: event.target.valueAsNumber,
          });
        }}
      />
      <p className="mt-1">Timer duration: {state.timerDuration}s</p>
      <Button
        className="mt-4 w-full"
        onClick={() => dispatch({ type: ActionType.Reset })}
      >
        Reset
      </Button>
    </div>
  );
}
