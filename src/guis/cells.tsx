const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

export default function Cells() {
  return (
    <div className="h-96 w-96 overflow-scroll rounded border border-neutral-400">
      <table>
        <thead>
          <tr>
            <th></th>
            {ALPHABET.map((letter) => (
              <th key={letter} className="border-b border-black">
                {letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {range(0, 100).map((rowNumber) => (
            <tr key={rowNumber}>
              <th className="border-r border-black">{rowNumber}</th>
              {range(0, 26).map((columnNumber) => (
                <td key={columnNumber}>{columnNumber}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
