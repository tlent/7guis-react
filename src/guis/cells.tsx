const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

export default function Cells() {
  return (
    <div className="overflow-scroll px-2 py-4">
      <table className="border-collapse">
        <thead>
          <tr>
            <th></th>
            {ALPHABET.map((letter) => (
              <th
                key={letter}
                className="border border-neutral-400 border-b-black"
              >
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {range(0, 100).map((row) => (
            <tr key={row}>
              <th className="border border-neutral-400 border-r-black">
                {row}
              </th>
              {range(0, 26).map((column) => (
                <td key={column} className="border border-neutral-400">
                  <Cell row={row} column={column} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ row, column }: { row: number; column: number }) {
  return (
    <div className="w-32 p-1 text-right text-sm">
      ({row}, {column})
    </div>
  );
}

function range(start: number, end: number): readonly number[] {
  const values = [];
  for (let value = start; value < end; value++) {
    values.push(value);
  }
  return values;
}
