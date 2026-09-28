import type { ReactNode } from "react";

import { resolveImage } from "../../lib/media";

/**
 * Form controls for the admin editors.
 *
 * Plain inputs on a plain background, deliberately unlike the public site: this
 * is an internal tool, and making it look like the foundation's pages would
 * invite editing it as if the changes were already live.
 */

const LABEL = "block text-xs font-semibold uppercase tracking-wide text-slate-600";
const INPUT =
  "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 " +
  "outline-none focus:border-slate-900";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  type?: "text" | "date" | "url";
  disabled?: boolean;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`${INPUT} ${disabled ? "bg-slate-100 text-slate-500" : ""}`}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  hint,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`${INPUT} leading-6`}
      />
    </Field>
  );
}

export function CheckboxField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded border border-slate-200 bg-white p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
      </span>
    </label>
  );
}

/** A photograph as it will actually be served, so a wrong reference is obvious. */
export function ImagePreview({ src }: { src: string }) {
  const url = resolveImage(src);
  if (!url) return null;

  return (
    <img
      src={url}
      alt=""
      className="mt-2 h-20 w-32 rounded border border-slate-200 object-cover"
      // A broken reference should read as broken rather than as an empty box.
      onError={(event) => {
        event.currentTarget.style.opacity = "0.25";
      }}
    />
  );
}

export type RepeaterColumn<T> = {
  key: Extract<keyof T, string>;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  /** Fraction of the row this column takes; defaults to an equal share. */
  width?: string;
};

/**
 * An editor for a list of same-shaped records — metrics, steps, FAQs, gallery
 * entries. Order matters in all of them (it is the order the page renders), so
 * moving a row is a first-class action rather than something to achieve by
 * retyping.
 */
export function Repeater<T extends Record<string, string>>({
  label,
  hint,
  value,
  onChange,
  columns,
  empty,
  addLabel,
  renderExtra,
}: {
  label: string;
  hint?: string;
  value: T[];
  onChange: (next: T[]) => void;
  columns: Array<RepeaterColumn<T>>;
  empty: T;
  addLabel: string;
  renderExtra?: (row: T, index: number) => ReactNode;
}) {
  const update = (index: number, key: Extract<keyof T, string>, next: string) => {
    onChange(value.map((row, i) => (i === index ? { ...row, [key]: next } : row)));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <span className={LABEL}>{label}</span>
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}

      <div className="mt-2 space-y-2">
        {value.map((row, index) => (
          <div key={index} className="rounded border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap gap-3">
              {columns.map((column) => (
                <div key={column.key} className={column.width ?? "min-w-[12rem] flex-1"}>
                  <span className="text-xs font-medium text-slate-500">{column.label}</span>
                  {column.textarea ? (
                    <textarea
                      rows={2}
                      value={row[column.key]}
                      placeholder={column.placeholder}
                      onChange={(event) => update(index, column.key, event.target.value)}
                      className={`${INPUT} leading-6`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={row[column.key]}
                      placeholder={column.placeholder}
                      onChange={(event) => update(index, column.key, event.target.value)}
                      className={INPUT}
                    />
                  )}
                </div>
              ))}
            </div>

            {renderExtra?.(row, index)}

            <div className="mt-2 flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="rounded border border-red-200 px-2 py-1 text-red-700"
              >
                Remove
              </button>
              <span className="ml-auto text-slate-400">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...value, { ...empty }])}
        className="mt-2 rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
      >
        {addLabel}
      </button>
    </div>
  );
}
