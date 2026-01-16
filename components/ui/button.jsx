export function Button({ children, className, variant, ...props }) {
  const baseClass = 'px-4 py-2 rounded font-medium transition';
  const variantClass =
    variant === 'outline'
      ? 'border border-slate-300 hover:bg-slate-50'
      : 'bg-indigo-600 hover:bg-indigo-700 text-white';

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
