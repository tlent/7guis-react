import { useState } from "react";

import Button from "../components/button";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="mx-auto flex w-32 flex-col justify-center rounded border border-neutral-400 p-6 shadow">
      <div className="mb-3 text-center text-5xl">{count}</div>
      <Button onClick={() => setCount((c) => c + 1)}>+1</Button>
    </div>
  );
}
