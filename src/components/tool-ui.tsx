"use client";

type Option<T extends string> = { id: T; label: string };

export function ChipGroup<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="chip-row" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`chip ${o.id === value ? "is-on" : ""}`}
            aria-pressed={o.id === value}
            onClick={(e) => {
              onChange(o.id);
              if (e.detail > 0) e.currentTarget.blur(); // mouse click: free the keyboard for shortcuts
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// True when the user is typing, so shortcuts should stay quiet.
export function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
}
