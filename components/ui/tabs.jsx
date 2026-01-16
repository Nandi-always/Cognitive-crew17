export function Tabs({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function TabsList({ children, className }) {
  return <div className={`flex gap-4 ${className}`}>{children}</div>;
}

export function TabsTrigger({ children, isActive, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium transition ${
        isActive ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-600'
      } ${className}`}
    >
      {children}
    </button>
  );
}
