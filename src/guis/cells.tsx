import { useState } from "react";

const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const ROW_COUNT = 100;
const COLUMN_COUNT = ALPHABET.length;

// TODO: Add support for formulas

interface Formula {
  formula: string;
  dependencies: readonly string[];
  value: number;
}

type CellValue = number | string | Formula;
type State = Map<number, CellValue>;

export default function Cells() {
  const [cellValues, setCellValues] = useState<State>(new Map());

  function handleCellChange(index: number, value?: CellValue) {
    setCellValues((previousValues) => {
      const newValues = new Map(previousValues);
      if (value === undefined) {
        newValues.delete(index);
      } else {
        newValues.set(index, value);
      }
      return newValues;
    });
  }

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
                const value = cellValues.get(index);
                return (
                  <td key={column} className="h-8 border border-neutral-400">
                    <Cell
                      cellValue={value}
                      onChange={(cellValue?: CellValue) =>
                        handleCellChange(index, cellValue)
                      }
                    />
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
  cellValue?: CellValue;
  onChange: (cellValue?: CellValue) => void;
}
function Cell({ cellValue, onChange }: CellProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  function handleBlur() {
    setFocused(false);
    const number = Number(value);
    let cellValue: CellValue | undefined;
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
  if (!focused && typeof cellValue === "number") {
    textAlign = "text-right";
  }

  return (
    <input
      type="text"
      className={`h-full cursor-default border-0 text-sm focus:cursor-text ${textAlign}`}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
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
