import { useReducer } from "react";
import Button from "../components/button";

enum ActionType {
  Add = "add",
  Update = "update",
  Delete = "delete",
  Select = "select",
  ChangeInputName = "change_input_name",
  ChangeInputSurname = "change_input_surname",
  ChangeFilterPrefix = "change_filter_prefix",
}

interface AddAction {
  type: ActionType.Add;
}

interface UpdateAction {
  type: ActionType.Update;
}

interface DeleteAction {
  type: ActionType.Delete;
}

interface SelectAction {
  type: ActionType.Select;
  id: number;
}

interface ChangeInputName {
  type: ActionType.ChangeInputName;
  name: string;
}

interface ChangeInputSurname {
  type: ActionType.ChangeInputSurname;
  surname: string;
}

interface ChangeFilterPrefix {
  type: ActionType.ChangeFilterPrefix;
  filterPrefix: string;
}

type Action =
  | AddAction
  | UpdateAction
  | DeleteAction
  | SelectAction
  | ChangeInputName
  | ChangeInputSurname
  | ChangeFilterPrefix;

interface FullName {
  name: string;
  surname: string;
}

interface State {
  records: {
    id: number;
    fullName: FullName;
  }[];
  selectedId?: number;
  inputName: string;
  inputSurname: string;
  filterPrefix: string;
}

const initialState: State = {
  records: [
    { id: 1, fullName: { name: "Hans", surname: "Emil" } },
    { id: 2, fullName: { name: "Max", surname: "Mustermann" } },
    { id: 3, fullName: { name: "Roman", surname: "Tisch" } },
  ],
  selectedId: undefined,
  inputName: "",
  inputSurname: "",
  filterPrefix: "",
};

let nextId = Math.max(0, ...initialState.records.map(({ id }) => id)) + 1;
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Add: {
      const id = nextId++;
      const fullName = {
        name: state.inputName,
        surname: state.inputSurname,
      };
      return {
        ...state,
        records: [...state.records, { id, fullName }],
        selectedId: id,
      };
    }
    case ActionType.Update: {
      const fullName = {
        name: state.inputName,
        surname: state.inputSurname,
      };
      return {
        ...state,
        records: state.records.map((record) =>
          record.id === state.selectedId ? { ...record, fullName } : record
        ),
      };
    }
    case ActionType.Delete: {
      return {
        ...state,
        records: state.records.filter(
          (record) => record.id !== state.selectedId
        ),
        selectedId: undefined,
        inputName: "",
        inputSurname: "",
      };
    }
    case ActionType.Select: {
      const selectedRecord = state.records.find(
        (record) => record.id === action.id
      );
      if (!selectedRecord) {
        throw new Error("Selected ID not found");
      }
      const { name, surname } = selectedRecord.fullName;
      return {
        ...state,
        selectedId: action.id,
        inputName: name,
        inputSurname: surname,
      };
    }
    case ActionType.ChangeInputName: {
      return { ...state, inputName: action.name };
    }
    case ActionType.ChangeInputSurname: {
      return { ...state, inputSurname: action.surname };
    }
    case ActionType.ChangeFilterPrefix: {
      if (state.selectedId) {
        const selectedRecord = state.records.find(
          (record) => record.id === state.selectedId
        );
        if (!selectedRecord) {
          throw new Error("Selected ID not found");
        }
        if (
          !matchesFilter(selectedRecord.fullName.surname, action.filterPrefix)
        ) {
          return {
            ...state,
            selectedId: undefined,
            inputName: "",
            inputSurname: "",
            filterPrefix: action.filterPrefix,
          };
        }
      }
      return { ...state, filterPrefix: action.filterPrefix };
    }
  }
}

export default function Crud() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const filteredRecords = state.records.filter((record) =>
    matchesFilter(record.fullName.surname, state.filterPrefix)
  );

  return (
    <div className="space-y-3 rounded border border-neutral-400 px-10 py-5 shadow">
      <div className="space-x-2">
        <label htmlFor="filter-prefix">Filter prefix:</label>
        <input
          type="text"
          id="filter-prefix"
          className="h-8 w-32 rounded"
          value={state.filterPrefix}
          onChange={(event) =>
            dispatch({
              type: ActionType.ChangeFilterPrefix,
              filterPrefix: event.target.value,
            })
          }
        />
      </div>
      <div className="flex space-x-4">
        <div className="w-48">
          <select
            size={Math.max(2, filteredRecords.length)}
            className="form-multiselect h-32 w-full bg-none"
            onChange={(event) =>
              dispatch({
                type: ActionType.Select,
                id: Number(event.target.value),
              })
            }
          >
            {filteredRecords.map(({ id, fullName }) => {
              const name = `${fullName.surname}, ${fullName.name}`;
              return (
                <option key={id} value={id} selected={id === state.selectedId}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between space-x-3">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              className="h-8 w-32 rounded"
              value={state.inputName}
              onChange={(event) =>
                dispatch({
                  type: ActionType.ChangeInputName,
                  name: event.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-between space-x-3">
            <label htmlFor="surname">Surname:</label>
            <input
              type="text"
              id="surname"
              className="h-8 w-32 rounded"
              value={state.inputSurname}
              onChange={(event) =>
                dispatch({
                  type: ActionType.ChangeInputSurname,
                  surname: event.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="space-x-2">
        <Button onClick={() => dispatch({ type: ActionType.Add })}>
          Create
        </Button>
        <Button onClick={() => dispatch({ type: ActionType.Update })}>
          Update
        </Button>
        <Button onClick={() => dispatch({ type: ActionType.Delete })}>
          Delete
        </Button>
      </div>
    </div>
  );
}

function matchesFilter(surname: string, filterPrefix: string) {
  return surname.toLowerCase().startsWith(filterPrefix.toLowerCase());
}
