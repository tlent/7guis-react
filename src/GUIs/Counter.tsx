import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="mb-3 text-center text-5xl">{count}</div>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="mx-auto w-24 rounded-full border border-neutral-200 px-4 py-1 text-sm font-semibold text-neutral-600 hover:border-transparent hover:bg-neutral-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        +1
      </button>
    </>
  );
}
