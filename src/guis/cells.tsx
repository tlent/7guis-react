import { useCallback, useState, memo } from "react";

const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const ROW_COUNT = 100;

const REFERENCE_FORMULA_REGEX = /^=\s*(?<reference>[a-z]\d+)\s*$/i;
const OPERATION_FORMULA_REGEX =
  /^=\s*(?<operation>sum|average|count|max|min)\s*\(\s*(?<start>[a-z]\d+)\s*:\s*(?<end>[a-z]\d+)\s*\)\s*$/i;

const EMPTY_CELL = { type: "empty" } as const;

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
  references: CellId[];
}

interface ReferenceFormula {
  type: "referenceFormula";
  formula: string;
  reference: CellId;
}

interface InvalidFormula {
  type: "invalidFormula";
  formula: string;
}

interface EmptyCell {
  type: "empty";
}

interface NumberCell {
  type: "number";
  value: number;
}

interface StringCell {
  type: "string";
  value: string;
}

type Formula = OperationFormula | ReferenceFormula | InvalidFormula;
type Cell = EmptyCell | NumberCell | StringCell | Formula;
type CellId = string;

export default function Cells() {
  const [cells, setCells] = useState<Map<CellId, Cell>>(new Map());
  const [calculatedValues, setCalculatedValues] = useState<
    Map<CellId, number | string>
  >(new Map());

  const handleCellChange = useCallback(
    (changedCellId: CellId, changedCell: Cell) => {
      setCells((previousCells) => {
        const newCells = new Map(previousCells);
        if (changedCell.type === "empty") {
          newCells.delete(changedCellId);
        } else {
          newCells.set(changedCellId, changedCell);
        }

        setCalculatedValues((previousCalculatedValues) => {
          const cellsToCalculate = new Set<CellId>(
            getDependentCells(changedCellId, newCells)
          );
          if (
            changedCell.type === "referenceFormula" ||
            changedCell.type === "operationFormula"
          ) {
            cellsToCalculate.add(changedCellId);
          }
          let addedNewCells = true;
          while (addedNewCells) {
            addedNewCells = false;
            for (const id of cellsToCalculate) {
              for (const dependentId of getDependentCells(id, newCells)) {
                if (!cellsToCalculate.has(dependentId)) {
                  cellsToCalculate.add(dependentId);
                  addedNewCells = true;
                }
              }
            }
          }

          const newCalculatedValues = new Map(previousCalculatedValues);
          while (cellsToCalculate.size > 0) {
            for (const id of cellsToCalculate) {
              const cell = newCells.get(id);
              if (cell === undefined) {
                throw new Error("cell from cellsToCalculate does not exist");
              }
              if (
                cell.type === "referenceFormula" &&
                !cellsToCalculate.has(cell.reference)
              ) {
                const referencedCell =
                  newCells.get(cell.reference) ?? EMPTY_CELL;
                let calculatedValue: number | string;
                switch (referencedCell.type) {
                  case "operationFormula":
                  case "referenceFormula": {
                    const referencedValue = newCalculatedValues.get(
                      cell.reference
                    );
                    if (referencedValue === undefined) {
                      throw new Error(
                        "referenced cell has no calculated value"
                      );
                    }
                    calculatedValue = referencedValue;
                    break;
                  }
                  case "invalidFormula": {
                    calculatedValue = "#REF!";
                    break;
                  }
                  case "number":
                  case "string": {
                    calculatedValue = referencedCell.value;
                    break;
                  }
                  case "empty": {
                    calculatedValue = "";
                    break;
                  }
                }
                newCalculatedValues.set(id, calculatedValue);
                cellsToCalculate.delete(id);
              } else if (
                cell.type === "operationFormula" &&
                cell.references.every(
                  (reference) => !cellsToCalculate.has(reference)
                )
              ) {
                const values: number[] = [];
                for (const reference of cell.references) {
                  const referencedCell = newCells.get(reference);
                  switch (referencedCell?.type) {
                    case "operationFormula":
                    case "referenceFormula": {
                      const referencedValue =
                        newCalculatedValues.get(reference);
                      if (referencedValue === undefined) {
                        throw new Error(
                          "referenced cell has no calculated value"
                        );
                      }
                      if (typeof referencedValue === "number") {
                        values.push(referencedValue);
                      }
                      break;
                    }
                    case "number": {
                      values.push(referencedCell.value);
                      break;
                    }
                    case "invalidFormula":
                    case "string":
                    case "empty": {
                      break;
                    }
                  }
                }
                let calculatedValue: number;
                switch (cell.operation) {
                  case Operation.Sum: {
                    calculatedValue = values.reduce((a, b) => a + b, 0);
                    break;
                  }
                  case Operation.Average: {
                    calculatedValue =
                      values.reduce((a, b) => a + b, 0) / values.length;
                    break;
                  }
                  case Operation.Count: {
                    calculatedValue = values.length;
                    break;
                  }
                  case Operation.Max: {
                    calculatedValue = Math.max(...values);
                    break;
                  }
                  case Operation.Min: {
                    calculatedValue = Math.min(...values);
                    break;
                  }
                }
                newCalculatedValues.set(id, calculatedValue);
                cellsToCalculate.delete(id);
              }
            }
          }
          return newCalculatedValues;
        });

        return newCells;
      });
    },
    []
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
              {ALPHABET.map((column) => {
                const id = `${column}${row}`;
                return (
                  <td key={column} className="h-8 border border-neutral-400">
                    <Cell
                      cellId={id}
                      cell={cells.get(id) ?? EMPTY_CELL}
                      calculatedValue={calculatedValues.get(id)}
                      onChange={handleCellChange}
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
  cellId: CellId;
  cell: Cell;
  onChange: (cellId: CellId, cell: Cell) => void;
  calculatedValue?: number | string;
}
const Cell = memo(function Cell({
  cellId,
  cell,
  onChange,
  calculatedValue,
}: CellProps) {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);

  const dynamicClasses = [];

  let displayValue: string | number = inputValue;
  if (!focused) {
    if (cell.type === "operationFormula" || cell.type === "referenceFormula") {
      if (calculatedValue === undefined) {
        throw new Error("formula without calculated value");
      }
      displayValue = calculatedValue;
    }
    if (cell.type === "invalidFormula") {
      displayValue = "#NAME?";
      dynamicClasses.push("bg-red-300");
    }
  }

  if (focused) {
    dynamicClasses.push("cursor-text");
  }
  if (!focused && !Number.isNaN(Number(displayValue))) {
    dynamicClasses.push("text-right");
  }

  function handleBlur() {
    setFocused(false);
    const number = Number(inputValue);
    let cell: Cell;
    if (inputValue === "") {
      cell = EMPTY_CELL;
    } else if (inputValue.startsWith("=")) {
      cell = parseFormula(inputValue);
    } else if (Number.isNaN(number)) {
      cell = { type: "string", value: inputValue };
    } else {
      cell = { type: "number", value: number };
    }
    onChange(cellId, cell);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "Enter": {
        if (focused) {
          handleBlur();
        }
        setFocused(!focused);
        break;
      }
      case "Escape": {
        setFocused(false);
        handleBlur();
        break;
      }
      default: {
        if (!focused) {
          setFocused(true);
          setInputValue("");
        }
        break;
      }
    }
  }

  return (
    <input
      type="text"
      className={`h-full cursor-default border-0 text-sm ${dynamicClasses.join(
        " "
      )}`}
      readOnly={!focused}
      value={displayValue}
      onChange={(event) => setInputValue(event.target.value)}
      onDoubleClick={() => setFocused(true)}
      onTouchStart={() => setFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
});

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
    return {
      type: "referenceFormula",
      formula,
      reference: reference.toUpperCase(),
    };
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
      references: getCellIdsInRange(start, end),
    };
  }
  return undefined;
}

function getCellIdsInRange(start: CellId, end: CellId): CellId[] {
  const startColumn = start[0].toUpperCase();
  const startRow = Number(start.slice(1));
  const endColumn = end[0].toUpperCase();
  const endRow = Number(end.slice(1));
  const columnRange = range(
    ALPHABET.indexOf(startColumn),
    ALPHABET.indexOf(endColumn) + 1
  );
  const rowRange = range(startRow, endRow + 1);
  return columnRange.flatMap((column) =>
    rowRange.map((row) => `${ALPHABET[column]}${row}`)
  );
}

function getDependentCells(id: CellId, cells: Map<CellId, Cell>): CellId[] {
  return [...cells.entries()]
    .filter(([, cell]) => {
      if (cell.type === "referenceFormula") {
        return cell.reference === id;
      } else if (cell.type === "operationFormula") {
        return cell.references.includes(id);
      }
      return false;
    })
    .map(([id]) => id);
}

function range(start: number, end: number): readonly number[] {
  const values = [];
  for (let value = start; value < end; value++) {
    values.push(value);
  }
  return values;
}
