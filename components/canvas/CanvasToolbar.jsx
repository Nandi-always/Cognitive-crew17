export function CanvasToolbar({ onSave }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-slate-100 rounded">
      <button
        onClick={onSave}
        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Save
      </button>
    </div>
  );
}
