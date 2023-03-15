import { useState } from "react";

import Button from "../components/button";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="mb-3 text-center text-5xl">{count}</div>
      <Button onClick={() => setCount((c) => c + 1)}>+1</Button>
    </>
  );
}
