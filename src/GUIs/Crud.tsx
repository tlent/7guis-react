import Button from "../components/button";

export default function Crud() {
  const names = ["Hello", "Hi", "Hiya"];
  return (
    <div className="space-y-3 rounded border border-neutral-400 px-10 py-5 shadow">
      <div>
        <label htmlFor="filter-prefix">Filter prefix:</label>
        <input
          type="text"
          id="filter-prefix"
          className="ml-2 h-8 w-32 rounded"
        />
      </div>
      <div className="flex">
        <div className="mr-4 w-48">
          <select
            size={names.length}
            className="form-multiselect h-32 w-full bg-none"
          >
            {names.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="mb-2 flex justify-between">
            <label htmlFor="name" className="mr-4">
              Name:
            </label>
            <input type="text" id="name" className="ml-auto h-8 w-32 rounded" />
          </div>
          <div className="flex justify-between">
            <label htmlFor="surname" className="mr-4">
              Surname:
            </label>
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
