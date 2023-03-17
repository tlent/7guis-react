const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

export default function Cells() {
  return (
    <table className="h-96 w-96 overflow-scroll">
      <thead>
        <tr>
          <th></th>
          {ALPHABET.map((letter) => (
            <th key={letter}>{letter}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {range(0, 100).map((rowNumber) => (
          <tr key={rowNumber}>
            <th>{rowNumber}</th>
            {range(0, 26).map((columnNumber) => (
              <td key={columnNumber}>{columnNumber}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function range(start: number, end: number): readonly number[] {
  const length = end - start;
  return [...Array.from({ length }).keys()].map((index) => index + start);
}
