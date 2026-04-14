import Link from "next/link";
import { NavUser } from "@/components/NavUser";

export function AppHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 reveal-up">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/90 px-3 py-1.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
          >
            <span className="inline-block size-2.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground group-hover:text-foreground">
              Wissen Seats
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </div>
        <NavUser />
      </div>
    </div>
  );
}
