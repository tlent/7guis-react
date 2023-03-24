import { useState } from "react";

const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const ROW_COUNT = 100;

const REFERENCE_FORMULA_REGEX = /^=(?<reference>[a-z]\d+)$/i;
const OPERATION_FORMULA_REGEX =
  /^=\s*(?<operation>sum|average|count|max|min)\s*\(\s*(?<start>[a-z]\d+)\s*:\s*(?<end>[a-z]\d+)\s*\)\s*$/i;

enum Operation {
  Sum = "SUM",
  Average = "AVERAGE",
  Count = "COUNT",
  Max = "MAX",
  Min = "MIN",
}

interface OperationFormula {
  type: "operationFormula";
  formula: string;
  operation: Operation;
  start: CellReference;
  end: CellReference;
}

interface ReferenceFormula {
  type: "referenceFormula";
  formula: string;
  reference: CellReference;
}

interface InvalidFormula {
  type: "invalidFormula";
  formula: string;
}

type Formula = OperationFormula | ReferenceFormula | InvalidFormula;

type CellReference = string;

type Cell =
  | { type: "empty" }
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | Formula;

type State = Map<CellReference, Cell>;

export default function Cells() {
  const [cells, setCells] = useState<State>(new Map());

  function handleCellChange(cellReference: CellReference, cell: Cell) {
    setCells((previousCells) => {
      const newCells = new Map(previousCells);
      if (cell.type === "empty") {
        newCells.delete(cellReference);
      } else {
        newCells.set(cellReference, cell);
      }
      return newCells;
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
              {ALPHABET.map((column) => {
                const cellReference = `${column}${row}`;
                const cell = cells.get(cellReference) ?? { type: "empty" };
                return (
                  <td key={column} className="h-8 border border-neutral-400">
                    <Cell
                      cell={cell}
                      onChange={(cell) => handleCellChange(cellReference, cell)}
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
  cell: Cell;
  onChange: (cell: Cell) => void;
}
function Cell({ cell, onChange }: CellProps) {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  function handleBlur() {
    setFocused(false);
    const number = Number(inputValue);
    let cell: Cell;
    if (inputValue === "") {
      cell = { type: "empty" };
    } else if (inputValue.startsWith("=")) {
      cell = parseFormula(inputValue);
    } else if (Number.isNaN(number)) {
      cell = { type: "string", value: inputValue };
    } else {
      cell = { type: "number", value: number };
    }
    onChange(cell);
  }

  let textAlign = "text-left";
  if (!focused && cell.type === "number") {
    textAlign = "text-right";
  }

  return (
    <input
      type="text"
      className={`h-full cursor-default border-0 text-sm focus:cursor-text ${textAlign}`}
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
    />
  );
}

function parseFormula(formula: string): Formula {
  const referenceFormula = parseReferenceFormula(formula);
  if (referenceFormula) {
    return referenceFormula;
  }
  const operationFormula = parseOperationFormula(formula);
  if (operationFormula) {
    return operationFormula;
  }
  return { type: "invalidFormula", formula };
}

function parseReferenceFormula(formula: string): ReferenceFormula | undefined {
  const result = REFERENCE_FORMULA_REGEX.exec(formula);
  if (result) {
    const { reference } = result.groups ?? {};
    return { type: "referenceFormula", formula, reference };
  }
  return undefined;
}

function parseOperationFormula(formula: string): OperationFormula | undefined {
  const result = OPERATION_FORMULA_REGEX.exec(formula);
  if (result) {
    const { operation, start, end } = result.groups ?? {};
    return {
      type: "operationFormula",
      formula,
      operation: operation.toUpperCase() as Operation,
      start: start.toUpperCase(),
      end: end.toUpperCase(),
    };
  }
  return undefined;
}

function range(start: number, end: number): readonly number[] {
  const values = [];
  for (let value = start; value < end; value++) {
    values.push(value);
  }
  return values;
}
