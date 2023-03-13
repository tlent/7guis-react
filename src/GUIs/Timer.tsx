import { useEffect, useReducer } from "react";
import Button from "../components/Button";

type State = {
  elapsedTime: number;
  timerDuration: number;
};

enum ActionType {
  Tick = "tick",
  SetDuration = "set_duration",
  Reset = "reset",
}

type TickAction = {
  type: ActionType.Tick;
  deltaTime: number;
};

type SetDurationAction = {
  type: ActionType.SetDuration;
  newTimerDuration: number;
};

type ResetAction = { type: ActionType.Reset };

type Action = TickAction | SetDurationAction | ResetAction;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Tick:
      return {
        ...state,
        elapsedTime: Math.min(
          state.elapsedTime + action.deltaTime,
          state.timerDuration
        ),
      };
    case ActionType.SetDuration:
      return {
        ...state,
        timerDuration: action.newTimerDuration,
        elapsedTime: Math.min(state.elapsedTime, action.newTimerDuration),
      };
    case ActionType.Reset:
      return { ...state, elapsedTime: 0 };
  }
}

type Props = {
  initialTimerDuration?: number;
};

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
    let prevTickTimestamp: DOMHighResTimeStamp;
    let id = requestAnimationFrame(tick);

    function tick(timestamp: DOMHighResTimeStamp) {
      if (prevTickTimestamp) {
        const deltaTime = (timestamp - prevTickTimestamp) / 1000;
        dispatch({ type: ActionType.Tick, deltaTime });
      }
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
        onChange={(e) => {
          dispatch({
            type: ActionType.SetDuration,
            newTimerDuration: e.target.valueAsNumber,
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
