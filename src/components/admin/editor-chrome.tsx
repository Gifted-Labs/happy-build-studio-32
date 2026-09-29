import { useState, type ReactNode } from "react";
import { ChevronLeft, Loader2, TriangleAlert } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { StatusPill } from "./shell";

/**
 * The frame shared by the outreach and news editors.
 *
 * Both are the same shape — a heading that says what is being edited and whether
 * it is live, a place for the error a save came back with, a stack of sections,
 * and one bar of actions. Holding that here keeps the two editors to the fields
 * that differ, and means Save behaves identically in both.
 */

export function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function EditorFrame({
  title,
  published,
  existing,
  busy,
  error,
  onClose,
  onSave,
  onDelete,
  deleteLabel,
  children,
}: {
  title: string;
  published: boolean;
  existing: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  deleteLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5 pb-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onClose} className="-ml-2">
          <ChevronLeft aria-hidden />
          Back
        </Button>
        <h2 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight">{title}</h2>
        <StatusPill published={published} />
      </div>

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>{error}</p>
        </div>
      ) : null}

      {children}

      {/* Sticky, because these forms are long enough that Save would otherwise be
          a scroll away from the field just edited. */}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-border bg-background/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <Button onClick={onSave} disabled={busy}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {busy ? "Saving…" : "Save"}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        {existing ? (
          <ConfirmDelete label={deleteLabel} onConfirm={onDelete} disabled={busy} />
        ) : null}
      </div>
    </div>
  );
}

/**
 * Deletion behind a second click rather than a browser `confirm()`, which blocks
 * the page and reads as a system error rather than a decision.
 */
export function ConfirmDelete({
  label,
  onConfirm,
  disabled,
}: {
  label: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <Button
        variant="ghost"
        onClick={() => setArmed(true)}
        disabled={disabled}
        className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        {label}
      </Button>
    );
  }

  return (
    <span className="ml-auto flex flex-wrap items-center gap-3 text-sm">
      <span className="text-muted-foreground">This cannot be undone.</span>
      <Button variant="destructive" size="sm" onClick={onConfirm} disabled={disabled}>
        Delete
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setArmed(false)}>
        Keep it
      </Button>
    </span>
  );
}
