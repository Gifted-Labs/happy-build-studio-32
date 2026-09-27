import type { ReactNode } from "react";
import { Icon } from "../landing/motion";

/**
 * Form primitives shared by every form on the site.
 *
 * Two variants: `light` for forms on white cards, `dark` for forms sitting on the
 * navy panels. Passing the variant rather than raw classes keeps error and focus
 * styling consistent across pages.
 */
export type Variant = "light" | "dark";

const inputBase =
  "mt-2 h-12 w-full rounded-md border px-4 font-normal outline-none transition-colors";

const inputVariant: Record<Variant, string> = {
  light: "border-input bg-white focus:border-primary focus:ring-4 focus:ring-primary/10",
  dark: "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/15",
};

const labelVariant: Record<Variant, string> = {
  light: "text-sm font-semibold text-navy-900",
  dark: "text-sm font-semibold text-white",
};

const errorClass = "!border-destructive focus:!ring-destructive/20";

function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm font-medium text-destructive">
      {children}
    </p>
  );
}

type BaseFieldProps = {
  name: string;
  label: string;
  variant?: Variant;
  error?: string;
  required?: boolean;
  className?: string;
};

type FieldProps = BaseFieldProps & {
  type?: "text" | "email" | "number";
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string | number;
  min?: number;
  inputMode?: "text" | "email" | "numeric";
};

export function Field({
  name,
  label,
  variant = "light",
  error,
  required,
  className,
  type = "text",
  autoComplete,
  placeholder,
  defaultValue,
  min,
  inputMode,
}: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <label className={`block ${labelVariant[variant]} ${className ?? ""}`}>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputBase} ${inputVariant[variant]} ${error ? errorClass : ""}`}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </label>
  );
}

export function TextareaField({
  name,
  label,
  variant = "light",
  error,
  required,
  className,
  rows = 6,
  placeholder,
}: BaseFieldProps & { rows?: number; placeholder?: string }) {
  const errorId = `${name}-error`;
  return (
    <label className={`block ${labelVariant[variant]} ${className ?? ""}`}>
      {label}
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 w-full resize-y rounded-md border p-4 font-normal outline-none transition-colors ${inputVariant[variant]} ${error ? errorClass : ""}`}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </label>
  );
}

export function SelectField({
  name,
  label,
  variant = "light",
  error,
  required,
  className,
  options,
  defaultValue,
}: BaseFieldProps & { options: Array<[string, string]>; defaultValue?: string }) {
  const errorId = `${name}-error`;
  return (
    <label className={`block ${labelVariant[variant]} ${className ?? ""}`}>
      {label}
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputBase} ${inputVariant[variant]} ${error ? errorClass : ""}`}
      >
        {options.map(([value, text]) => (
          <option key={value} value={value} className="text-ink-900">
            {text}
          </option>
        ))}
      </select>
      <FieldError id={errorId}>{error}</FieldError>
    </label>
  );
}

export function SubmitButton({
  children,
  pending,
  disabled,
  variant = "light",
  className,
}: {
  children: ReactNode;
  pending: boolean;
  disabled?: boolean;
  variant?: Variant;
  className?: string;
}) {
  const styles =
    variant === "dark"
      ? "bg-brand-mint text-ink-900 hover:bg-white"
      : "bg-primary text-white hover:bg-navy-800";

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      // aria-busy announces the pending state without the label text changing twice.
      aria-busy={pending}
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-md px-6 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className ?? ""}`}
    >
      {pending ? "Sending…" : children}
    </button>
  );
}

/** Success panel shown in place of the form once a submission lands. */
export function SubmissionSuccess({
  title,
  body,
  reference,
  variant = "light",
  onReset,
}: {
  title: string;
  body: string;
  reference: string;
  variant?: Variant;
  onReset: () => void;
}) {
  const dark = variant === "dark";
  return (
    <div
      role="status"
      className={`rounded-lg p-8 text-center ${dark ? "bg-white/10 text-white" : "bg-surface-muted text-navy-900"}`}
    >
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-mint text-ink-900">
        <Icon name="check" className="text-[22px]" />
      </span>
      <h3 className="mt-5 font-display text-h3">{title}</h3>
      <p className={`mt-3 text-body-sm ${dark ? "text-white/75" : "text-on-surface-variant"}`}>
        {body}
      </p>
      <p className={`mt-4 text-body-sm ${dark ? "text-white/60" : "text-on-surface-variant"}`}>
        Your reference is <strong className="font-semibold">{reference}</strong>
      </p>
      <button
        type="button"
        onClick={onReset}
        className={`mt-6 text-sm font-semibold underline ${dark ? "text-brand-mint" : "text-primary"}`}
      >
        Send another
      </button>
    </div>
  );
}

/** Error banner for failures that are not tied to one field. */
export function SubmissionError({ children }: { children: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive"
    >
      <Icon name="error" className="mt-px shrink-0 text-[18px]" />
      <span>{children}</span>
    </div>
  );
}
