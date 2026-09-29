import { useId, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ImageOff, Plus, Trash2 } from "lucide-react";

import { resolveImage } from "../../lib/media";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

/**
 * Form controls for the admin editors.
 *
 * Built on the project's own input components so every field in the editor
 * shares one focus ring, one border and one disabled state. The surfaces stay
 * plainer than the public site's on purpose: this is the tool that edits the
 * pages, and it should not be mistaken for them.
 */

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-wide">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
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
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cn(disabled && "bg-muted text-muted-foreground")}
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
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="leading-relaxed"
      />
    </Field>
  );
}

/**
 * Publishing is a switch rather than a checkbox: it is the one control on the
 * page that changes what the public sees, and it should read as a state that is
 * on or off rather than an item that is ticked.
 */
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
  const id = useId();
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border p-4 transition-colors",
        checked ? "border-primary/40 bg-primary/5" : "border-border bg-card",
      )}
    >
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="mt-0.5" />
      <div className="min-w-0">
        <Label htmlFor={id} className="text-sm font-semibold">
          {label}
        </Label>
        {hint ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}

/** A photograph as it will actually be served, so a wrong reference is obvious. */
export function ImagePreview({ src }: { src: string }) {
  const url = resolveImage(src);
  if (!url) {
    return (
      <div className="mt-2 grid h-20 w-32 place-items-center rounded-lg border border-dashed border-border bg-muted/50">
        <ImageOff className="size-4 text-muted-foreground/60" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className="mt-2 h-20 w-32 rounded-lg border border-border object-cover"
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
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wide">{label}</Label>
        {value.length > 0 ? (
          <span className="text-xs tabular-nums text-muted-foreground">
            {value.length} {value.length === 1 ? "entry" : "entries"}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}

      <div className="mt-2 space-y-2">
        {value.map((row, index) => (
          <div key={index} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-2 pb-2">
              <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                #{index + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${label} ${index + 1} up`}
                >
                  <ArrowUp />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => move(index, 1)}
                  disabled={index === value.length - 1}
                  aria-label={`Move ${label} ${index + 1} down`}
                >
                  <ArrowDown />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                  aria-label={`Remove ${label} ${index + 1}`}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={cn("space-y-1", column.width ?? "min-w-[12rem] flex-1")}
                >
                  <Label className="text-xs font-medium text-muted-foreground">
                    {column.label}
                  </Label>
                  {column.textarea ? (
                    <Textarea
                      rows={2}
                      value={row[column.key]}
                      placeholder={column.placeholder}
                      onChange={(event) => update(index, column.key, event.target.value)}
                      className="leading-relaxed"
                    />
                  ) : (
                    <Input
                      type="text"
                      value={row[column.key]}
                      placeholder={column.placeholder}
                      onChange={(event) => update(index, column.key, event.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            {renderExtra?.(row, index)}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { ...empty }])}
        className="mt-2"
      >
        <Plus aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}
