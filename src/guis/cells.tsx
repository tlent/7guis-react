import { useState } from "react";

const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const ROW_COUNT = 100;
const COLUMN_COUNT = ALPHABET.length;

type CellValue = number | string | undefined;

export default function Cells() {
  const [cellValues, setCellValues] = useState<CellValue[]>(
    Array.from({ length: ROW_COUNT * COLUMN_COUNT })
  );

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
          {range(0, ROW_COUNT).map((row) => (
            <tr key={row}>
              <th className="border border-neutral-400 border-r-black">
                {row}
              </th>
              {range(0, COLUMN_COUNT).map((column) => {
                const index = row * COLUMN_COUNT + column;
                const onChange = (value: CellValue) => {
                  setCellValues((cellValues) => {
                    const newCellValues = [...cellValues];
                    newCellValues[index] = value;
                    return newCellValues;
                  });
                };
                return (
                  <td key={column} className="h-8 border border-neutral-400">
                    <Cell value={cellValues[index]} onChange={onChange} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CellProps {
  value: CellValue;
  onChange: (value: CellValue) => void;
}
function Cell({ value, onChange }: CellProps) {
  const [focused, setFocused] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const number = Number(value);
    let cellValue: CellValue;
    if (value === "") {
      cellValue = undefined;
    } else if (Number.isNaN(number)) {
      cellValue = value;
    } else {
      cellValue = number;
    }
    onChange(cellValue);
  }

  let textAlign = "text-left";
  if (!focused && typeof value === "number") {
    textAlign = "text-right";
  }
  return (
    <input
      type="text"
      className={`h-full border-0 text-sm ${textAlign}`}
      value={value ?? ""}
      onChange={handleChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function range(start: number, end: number): readonly number[] {
  const values = [];
  for (let value = start; value < end; value++) {
    values.push(value);
  }
  return values;
}
