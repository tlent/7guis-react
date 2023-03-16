import Button from "../components/button";

export default function CircleDrawer() {
  return (
    <div className="space-y-4 rounded border border-neutral-400 p-6 shadow">
      <div className="flex justify-center space-x-2">
        <Button>Undo</Button>
        <Button>Redo</Button>
      </div>
      <div className="h-64 w-96 border border-black"></div>
    </div>
  );
}
