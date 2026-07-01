interface QuantitySelectorProps {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, max, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-300 bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="px-4 py-2 text-lg text-slate-600 transition hover:text-brand"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-12 px-2 text-center text-sm font-semibold text-ink">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="px-4 py-2 text-lg text-slate-600 transition hover:text-brand"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
