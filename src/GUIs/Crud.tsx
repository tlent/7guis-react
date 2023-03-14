import Button from "../components/button";

export default function Crud() {
  const names = ["Hello", "Hi", "Hiya"];
  return (
    <div className="space-y-3 rounded border border-neutral-400 px-10 py-5 shadow">
      <div className="space-x-2">
        <label htmlFor="filter-prefix">Filter prefix:</label>
        <input type="text" id="filter-prefix" className="h-8 w-32 rounded" />
      </div>
      <div className="flex space-x-4">
        <div className="w-48">
          <select
            size={names.length}
            className="form-multiselect h-32 w-full bg-none"
          >
            {names.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between space-x-3">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" className="h-8 w-32 rounded" />
          </div>
          <div className="flex justify-between space-x-3">
            <label htmlFor="surname">Surname:</label>
            <input type="text" id="surname" className="h-8 w-32 rounded" />
          </div>
        </div>
      </div>
      <div className="space-x-2">
        <Button>Create</Button>
        <Button>Update</Button>
        <Button>Delete</Button>
      </div>
    </div>
  );
}
