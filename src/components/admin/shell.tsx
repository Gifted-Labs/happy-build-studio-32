import { useState, type ReactNode } from "react";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

/**
 * The frame every admin screen sits in.
 *
 * The admin area is the one part of this project a person uses for an hour at a
 * time rather than reading once, so it is built like a tool: a fixed nav that
 * never moves, a header that says where you are, and a single content column.
 *
 * It uses the project's design tokens (bg-card, text-muted-foreground, …) rather
 * than the public site's components. Same palette, different furniture — an
 * editor should never mistake this page for the page it is editing.
 */

export type NavItem<T extends string> = {
  id: T;
  label: string;
  icon: LucideIcon;
  /** Shown as a pill beside the label. Omitted when there is nothing to count. */
  count?: number;
};

/** Access signs a person out through this path on the application's own domain. */
const SIGN_OUT = "/cdn-cgi/access/logout";

function Brand() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
      >
        LS
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-semibold text-sidebar-foreground">
          Life Story
        </span>
        <span className="block truncate text-xs text-muted-foreground">Foundation admin</span>
      </span>
    </div>
  );
}

function NavList<T extends string>({
  nav,
  current,
  onNavigate,
}: {
  nav: Array<NavItem<T>>;
  current: T;
  onNavigate: (id: T) => void;
}) {
  return (
    <nav className="flex-1 space-y-1 px-3" aria-label="Admin sections">
      {nav.map(({ id, label, icon: Icon, count }) => {
        const active = id === current;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="flex-1 text-left">{label}</span>
            {typeof count === "number" ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs tabular-nums",
                  active ? "bg-white/20" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function SignedIn({ email }: { email: string }) {
  return (
    <div className="border-t border-sidebar-border p-3">
      <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Signed in
      </p>
      <p className="mt-1 truncate px-2 text-sm text-sidebar-foreground" title={email}>
        {email}
      </p>
      <a
        href={SIGN_OUT}
        className="mt-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <LogOut className="size-3.5" aria-hidden />
        Sign out
      </a>
    </div>
  );
}

export function AdminShell<T extends string>({
  nav,
  current,
  onNavigate,
  email,
  title,
  description,
  actions,
  children,
}: {
  nav: Array<NavItem<T>>;
  current: T;
  onNavigate: (id: T) => void;
  email: string;
  title: string;
  description?: string;
  /** Primary action for the section, e.g. "New outreach". */
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id: T) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <Brand />
      <NavList nav={nav} current={current} onNavigate={go} />
      <SignedIn email={email} />
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/40 font-sans text-foreground">
      {/* Desktop rail. Fixed so a long inbox scrolls under it rather than past it. */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer. A plain overlay rather than a dialog component: there is
          nothing beneath it to trap focus away from, and it must open instantly. */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-foreground/40"
          />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-sidebar-border bg-sidebar shadow-xl">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(false)}
              className="absolute right-2 top-4"
              aria-label="Close menu"
            >
              <X />
            </Button>
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 md:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
              {description ? (
                <p className="truncate text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

/** A single figure with its label — the row of them across the top of a section. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "warning";
}) {
  return (
    <Card className={cn(tone === "warning" && "border-destructive/30 bg-destructive/5")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {Icon ? (
            <Icon
              className={cn(
                "size-4 shrink-0",
                tone === "warning" ? "text-destructive" : "text-muted-foreground",
              )}
              aria-hidden
            />
          ) : null}
        </div>
        <p
          className={cn(
            "mt-2 text-2xl font-semibold tabular-nums tracking-tight",
            tone === "warning" && "text-destructive",
          )}
        >
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

/** Shown where a list would be, when the list is empty. */
export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <Icon className="mx-auto size-8 text-muted-foreground/60" aria-hidden />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/** Published / Draft, the one piece of state that matters on every content row. */
export function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        published
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", published ? "bg-primary" : "bg-muted-foreground/50")}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}
